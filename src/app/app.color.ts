export class RGB {

  private r: number = 0;
  private g: number = 0;
  private b: number = 0;
  private alpha: number = 1;
  private value: number = 0;

  constructor(r: number, g: number, b: number) {
    this.setRed(r).setGreen(g).setBlue(b);
    this.updateValue();
  }

  private getHexPart(v: number): string {
    let h: string = v.toString(16);
    return (h.length > 1) ? h : "0"+h;
  }

  public updateValue(): RGB {
    this.value = (this.getRed() + this.getGreen() + this.getBlue());
    return this;
  }

  public getValue(): number {
    return this.value;
  }

  public toHex(): HEX {
    let hexString: string = (this.getAlpha() < 1) ?  this.toHexAlpha().toString() : "#"+this.getHexPart(this.getRed())+this.getHexPart(this.getGreen())+this.getHexPart(this.getBlue());
    return new HEX(hexString);
  }

  public toHexAlpha(light: boolean = true): HEX {
    let tmpRgb: RGB = new RGB(this.getRed(), this.getGreen(), this.getBlue());
    if (this.getAlpha() < 1) {
      let tmp: number = (1 - this.getAlpha());
      tmpRgb.setRed(tmpRgb.getRed() * tmp);
      tmpRgb.setGreen(tmpRgb.getGreen() * tmp);
      tmpRgb.setBlue(tmpRgb.getBlue() * tmp);
    }
    let adjustValue: number = (this.getAlpha() < 1) ? Math.floor(255 * this.getAlpha()) : 0;
    return (light) ? tmpRgb.lighten(adjustValue).toHex() : tmpRgb.darken(adjustValue).toHex();
  }

  public setRed(value : number): RGB {
    this.r = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
    return this.updateValue();
  }

  public getRed(): number {
    return this.r;
  }

  public setGreen(value: number): RGB {
    this.g = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
    return this.updateValue();
  }

  public getGreen(): number {
    return this.g;
  }

  public setBlue(value : number): RGB {
    this.b = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
    return this.updateValue();
  }

  public getBlue(): number {
    return this.b;
  }

  public setAlpha(a: number): RGB {
    this.alpha = (a <= 1 && a >= 0) ? a : 1;
    return this;
  }

  public getAlpha(): number {
    return this.alpha;
  }

  public lighten(by: number): RGB {
    this.setRed(this.getRed() + by)
        .setBlue(this.getBlue() + by)
        .setGreen(this.getGreen() + by);
    return this.updateValue();
  }

  public darken(by: number): RGB {
    this.setRed(this.getRed() - by)
        .setBlue(this.getBlue() - by)
        .setGreen(this.getGreen() - by);
    return this.updateValue();
  }

  public toString(): string {
    return (this.alpha < 1) ? 'rgba('+this.getRed()+','+this.getGreen()+','+this.getBlue()+','+this.getAlpha()+')' : 'rgb('+this.getRed()+','+this.getGreen()+','+this.getBlue()+')';
  }

}

export class HEX {

  private hex: string = "#000000";

  constructor(hex: string) {
    this.hex = (hex.toString().length == 6) ? "#"+hex : (hex.toString().length == 7) ? hex : '';
  }

  public toRGB(): RGB {
    let hexString: string = this.hex.substr(1).toString();
    return new RGB(parseInt(hexString.substr(0,2),16),parseInt(hexString.substr(2,2),16),parseInt(hexString.substr(4,2),16));
  }

  public toString() : string {
    return this.hex;
  }

}

export class Color {

  private hex: HEX = new HEX('');
  private rgb: RGB = new RGB(0,0,0);

  constructor(color : (HEX | RGB)) {

    if(color instanceof HEX) {
      this.hex = color;
      this.rgb = color.toRGB();
    } else if(color instanceof RGB) {
      this.rgb = color;
      this.hex = color.toHex();
    }

  }

  public lighten(by : number) : Color {
    this.rgb = this.rgb.lighten(by);
    this.hex = this.rgb.toHex();
    return this;
  }

  public darken(by : number) : Color {
    this.rgb = this.rgb.darken(by);
    this.hex = this.rgb.toHex();
    return this;
  }

  public toString(rgb : boolean = true) : string {
    return (rgb) ? this.rgb.toString() : this.hex.toString();
  }

  public setAlpha(a : number) : Color {
    this.rgb.setAlpha(a);
    this.hex = this.rgb.toHex();
    return this;
  }

}
