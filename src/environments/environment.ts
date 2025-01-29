export class Environment  {
  production: boolean
  API_URL: string
  constructor(){
    this.production=true,
    this.API_URL="https://backend.ez-marketing-us.com/"
    //this.API_URL="http://localhost:8000/"
  }
};

export const environment= new Environment()