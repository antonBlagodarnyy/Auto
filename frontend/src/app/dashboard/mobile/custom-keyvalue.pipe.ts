import { Pipe } from '@angular/core';

@Pipe({ name: 'filterKeys', standalone: true })
export class FilterKeysPipe {
  transform(obj: Record<string, any>, excludedKeys: string[]) {
    if (!obj) return [];

    return Object.entries(obj)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => ({ key, value }));
  }
}
