export type PatchOp = 'add' | 'replace' | 'remove';

export interface IPatchDto {
  op: PatchOp;
  path: string;
  value?: string;
}

export class PatchDto implements IPatchDto {
  op: PatchOp = 'replace';
  path: string = '';
  value?: string;

  constructor(obj: any = null) {
    if (obj) {
      this.op = obj.op;
      this.path = obj.path;
      this.value = obj.value;
    }
  }

  static Create(op: PatchOp, path: string, value?: string): PatchDto {
    return new PatchDto({op, path, value});
  }

}