import {UserTypeEnum} from '../../../types/user-type.enum';

export const CreateUserValidationMessage = {
  name: {
    invalidFormat: 'Name must be a string',
    length: 'Name length must be between 1 and 15 characters',
  },
  email: {
    invalidFormat: 'Email must be a valid address',
  },
  avatarPath: {
    invalidFormat: 'Avatar path must be a string',
    invalidExtension: 'Avatar must be in .jpg or .png format',
  },
  password: {
    invalidFormat: 'Password must be a string',
    length: 'Password length must be between 6 and 12 characters',
  },
  type: {
    invalid: `User type must be one of: ${Object.values(UserTypeEnum).join(', ')}`,
  },
} as const;
