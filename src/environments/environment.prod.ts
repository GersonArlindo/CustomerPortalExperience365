export class Environment  {
  production: boolean;
  API_URL: string
  constructor(){
    this.production=true;
    //this.API_URL= "http://localhost:8000/"
    this.API_URL="https://backend.ez-marketing-us.com/"
  }
}
export const environment=new Environment()
