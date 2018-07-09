export class Paginacion {
    totalItems: number = 0;
    draw: number = 1;
    maxSize: number = 5;
    boundaryLinks: boolean = true;
    length: number = 10;
    nextText: string = ">";
    previousText: string = "<";
    firstText: string = "<<";
    lastText: string = ">>";
    pageSize: number = 10;
    constructor() {}
}