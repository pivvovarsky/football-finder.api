// import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
// import { FirstFilter } from "./first.filter";
// import { SecondFilter } from "./second.filter";

// @Catch()
// export class CombinedFilter implements ExceptionFilter {
//   private firstFilter: FirstFilter;
//   private secondFilter: SecondFilter;

//   constructor() {
//     this.firstFilter = new FirstFilter();
//     this.secondFilter = new SecondFilter();
//   }

//   catch(exception: any, host: ArgumentsHost) {
//     // Dodaj dodatkową logikę lub warunki tutaj
//     this.firstFilter.catch(exception, host);
//     this.secondFilter.catch(exception, host);
//   }
// }
