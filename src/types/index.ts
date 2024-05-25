export type createUserParams = {
  password: string;
  username: string;
  profilePicture: string;
};

export type UserType = {
  username: string;
  profilePicture: string;
  createdAt: Date;
  _id: string;
};
