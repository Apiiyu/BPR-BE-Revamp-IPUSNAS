export {};

/**
 * @description Here's a way to extend the global interfaces.
 */
declare global {
  interface IRequestUser {
    id: string;
    email: string;
    name: string;
  }

  interface IResultFilter {
    data: any[];
    total: number;
    totalData: number;
  }
}
