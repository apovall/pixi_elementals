import { Application } from 'pixi.js'
import { Scene } from './scenes/scene';
import { MapGenerator } from './generators/map';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

const sceny: Scene = new Scene(app.screen.width, app.screen.height)
const mapGen: MapGenerator = new MapGenerator(10,10)
let noiseMap = mapGen.seedNoiseMap(0.4)
mapGen.applyCellularAutomaton(noiseMap, 1)

app.stage.addChild(sceny)

// const conty: Container = new Container()
// conty.x = 0
// conty.y = 0
// conty.angle = 45

// const conty2: Container = new Container()
// conty2.x = 0
// conty2.y = 0
// conty2.angle = -45

// const clampy: Sprite = Sprite.from("img/clampy.png");
// clampy.x = 0
// clampy.y = 0

// const clampy2: Sprite = Sprite.from('img/clampy.png')
// clampy2.x = 100
// clampy2.y = 100
// clampy2.angle = 15

// app.stage.addChild(conty)
// app.stage.addChild(conty2)
// conty.addChild(clampy);
// conty2.addChild(clampy2);
