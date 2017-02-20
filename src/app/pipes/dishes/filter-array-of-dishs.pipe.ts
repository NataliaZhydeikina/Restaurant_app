import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArrayOfDishs'
})
export class FilterArrayOfDishsPipe implements PipeTransform {

  transform(arr: string[], inputText: string ): string[] {
    let resultArr = [];
    for(let i = 0; arr.length > i; i++){
      if (arr[i].toLowerCase().indexOf(inputText.toLowerCase()) != -1) {
        resultArr.push(arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase());
      }
    }
    return resultArr;
  }
}
