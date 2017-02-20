import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dishesFilter'
})
export class DishesFilterPipe implements PipeTransform {
  transform(dishName: string, inputText: string): string {
    let currentName = '';
        if(!dishName.search(inputText)){
          currentName = dishName;
        }

    return currentName;
  }
  /*transform(dishesNames: string[], inputText: string): string[] {
    let currentNames = [];
    for (let i = 0; i < dishesNames.length; i++) {
        if(dishesNames[i].search(inputText)){
          currentNames.push(dishesNames[i]);
        }
    }
    return currentNames;
  }*/
}
