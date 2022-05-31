interface BaseModel {
  updatedAt: string;
  createdAt: string;
}

export interface User extends BaseModel {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}
