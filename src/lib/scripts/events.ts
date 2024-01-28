export class idbqEvent {
  fire(event: string, data: any) {
    const ev = new CustomEvent(event, { detail: data });
  }
}
