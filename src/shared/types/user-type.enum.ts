export enum UserTypeEnum {
  Default = 'обычный',
  Pro = 'pro'
}

export type UserType = keyof typeof UserTypeEnum;
