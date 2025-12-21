
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client';
import { Logger, PinoLogger } from '../../shared/libs/logger';
import { DefaultUserService, UserModel } from '../../shared/modules/user';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Offer } from '../../shared/types';
import {FavoriteModel} from '../../shared/modules/offer/favorite.entity';
import {CommentModel} from '../../shared/modules/comment';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new PinoLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel, FavoriteModel, CommentModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.createOffer({
      authorId: user.id,
      title: offer.title,
      description: offer.description,
      previewImage: offer.previewImage,
      createdDate: offer.createdDate,
      price: offer.price,
      type: offer.type,
      city: offer.city.name,
      isPremium: offer.isPremium,
      guestsCount: offer.guestsCount,
      roomsCount: offer.roomsCount,
      photos: offer.photos,
      features: offer.features,
      location: offer.location,
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
