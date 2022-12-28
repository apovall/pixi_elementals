/* 
  Purpose: Module to 
    Generate initial map noise seed
    Generate initial map with multipass cellular automata

*/
import _ from "lodash";
import { Graphics, DisplayObject } from "pixi.js";

type FloorMap = Array<Array<String>>;
export class MapGenerator {
  private readonly mapWidth: number;
  private readonly mapHeight: number;
  private readonly screenHeight: number;
  private readonly screenWidth: number;
  private readonly floorTile: string;
  private readonly wallTile: string;
  private readonly wallCountThreshold: number;

  // constructor( height, width)
  constructor(mapWidth:number, mapHeight:number, screenWidth: number, screenHeight: number ) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.floorTile = ".";
    this.wallTile = "x";
    this.wallCountThreshold = 4;
  }

  seedNoiseMap(buildableDensity: number): FloorMap {
    /*   
      args:
        buildableDensity: specifies whether an element will be 'buildable' or not. Treat as percentage.
      returns:
        noiseMap to act as a seed for cellular automaton
        for creating the initial map on which to build 
    */

    // Create 2D array[height[row]]
    let noiseMap: FloorMap = [];
    // Cycle through the array to create a random noise map
    for (let height = 0; height < this.mapHeight; height++) {
      noiseMap.push([]);
      for (let width = 0; width < this.mapWidth; width++) {
        if (Math.random() <= buildableDensity) {
          noiseMap[height].push(this.floorTile); //Floor tile
        } else {
          noiseMap[height].push(this.wallTile); //Wall tile
        }
      }
    }
    return noiseMap;
  }
  // cellular_automata procedural smoothing (seedMap, passes): map
  applyCellularAutomaton(grid: FloorMap, count: number): FloorMap {
    /*
      args:
        grid - the incoming noise map
        count - number of times to loop through the cellular automaton algorithm
      returns:
        smoothed map for populating
    */
    console.log(_.cloneDeep(grid));
    for (let runCount = 0; runCount < count; runCount++) {
      let neighbourWallCount: number;

      for (let passes = 0; passes < count; passes++) {
        let tempGrid = _.cloneDeep(grid); // To not work use noiseMap as both input and output
        // let p = [...grid.map(x => [...x])]
        for (
          let heightSearch = 0;
          heightSearch < this.mapHeight;
          heightSearch++
        ) {
          for (
            let widthSearch = 0;
            widthSearch < this.mapWidth;
            widthSearch++
          ) {
            neighbourWallCount = 0;
            for (
              let heightBounds = heightSearch - 1;
              heightBounds <= heightSearch + 1;
              heightBounds++
            ) {
              for (
                let widthBounds = widthSearch - 1;
                widthBounds <= widthSearch + 1;
                widthBounds++
              ) {
                if (this.checkMapBoundary(heightBounds, widthBounds)) {
                  // Check if search item is not equal to the current cell
                  if (
                    heightBounds != heightSearch ||
                    widthBounds != widthSearch
                  ) {
                    if (tempGrid[heightBounds][widthBounds] == this.wallTile) {
                      neighbourWallCount++;
                    }
                  }
                } else {
                  neighbourWallCount++;
                }
              }
            }
            if (neighbourWallCount > this.wallCountThreshold) {
              grid[heightSearch][widthSearch] = this.wallTile;
            } else {
              grid[heightSearch][widthSearch] = this.floorTile;
            }
          }
        }
      }
    }
    console.log(grid);
    return grid;
  }

  checkMapBoundary(heightBounds: number, widthBounds: number): boolean {
    /* 
      Check the upper and lower bounds, to see if they've gone out size of the array
    */

    if (heightBounds <= -1 || heightBounds > this.mapHeight - 1) {
      return false;
    }
    if (widthBounds <= -1 || widthBounds > this.mapWidth - 1) {
      return false;
    }
    return true;
  }

  growMapVertically(side: "top" | "bottom", currentMap: FloorMap): FloorMap {
    let newMap = _.cloneDeep(currentMap);
    let newRow: Array<String> = Array(currentMap[0].length).fill(this.wallTile);

    if (side === "top") {
      newMap.unshift(newRow);
    }
    if (side === "bottom") {
      newMap.push(newRow);
    }

    return newMap;
  }

  generateTile(
    /* 
      Purpose: Generate a single tile, to be rendered on stage else where
      Args:
        x: absolute x position on stage (px)
        y: absolute y position on stage (px)
        width: tile width (px) 
        height: tile height (px)
        topColor, leftColor, rightColor: colours used for each face, (hex)
    */
    x: number,
    y: number,
    width: number,
    height: number,
    baseColour: number,
  ) {

    let topSide = new Graphics();
    topSide.beginFill(baseColour);
    topSide.drawRect(0, 0, width, width);
    topSide.endFill();
    // x, y, scaleX, scaleY, rotation, skewX, skewY, pivotX, pivotY
    topSide.setTransform(x*1.75, y + width * 0.5, 1, 1, 0, 1.1, -0.5, 0, 0);
  
    let leftSide = new Graphics();
    leftSide.beginFill(baseColour+0x700150);
    leftSide.drawRect(0, 0, height, width);
    leftSide.endFill();
    leftSide.setTransform(x*1.75, y + width * 0.5, 1, 1, 0, 1.1, 1.57, 0, 0);
  
    let rightSide = new Graphics();
    rightSide.beginFill(baseColour-0x700150);
    rightSide.drawRect(0, 0, width, height);
    rightSide.endFill();
    rightSide.setTransform(x*1.75, y + width * 0.5, 1, 1, 0, -0.0, -0.5, -(width + (width * 0.015)), -(width - (width * 0.06)));
  
    return {topSide,leftSide,rightSide}
  }

  renderTiles(gameMap:FloorMap, stage:any){
    /* 
      Purpose: Render the tiles to the stage
      Args:
        gameMap: previously generated array of arrays map, detailing what is a floor & what is a wall
        stage: The PIXIJS stage object to render onto

    */

    type Tile = {
      topSide: DisplayObject,
      leftSide: DisplayObject,
      rightSide: DisplayObject
    }

    console.log(this.screenWidth, gameMap[0].length, this.screenWidth / gameMap[0].length);
    
    let tileWidth = this.screenWidth / gameMap[0].length
    let tileHeight = this.screenHeight / gameMap.length
    let baseColour = 0xFF0C0C
    let tileTemp:Tile
    let heightPositionTracker:number = 0
    let widthPositionTracker:number
   
    for(let mapRow = 0; mapRow < gameMap[0].length; mapRow++ ){
      // To allow for alternating of each subsequent row
      if(mapRow % 2 === 0){
        widthPositionTracker = 0
      } else {
        widthPositionTracker = tileWidth / 2 
      }
      for(let mapElement = 0; mapElement < gameMap[0].length; mapElement++){   
        if(gameMap[mapRow][mapElement] === this.floorTile){
          tileTemp = this.generateTile(widthPositionTracker, heightPositionTracker, tileWidth, 0, baseColour)
        } else {
          tileTemp = this.generateTile(widthPositionTracker, heightPositionTracker, tileWidth, 0, 0x352C2C)
        }
        // Render tiles to stage
        stage.addChild(tileTemp['topSide'])
        stage.addChild(tileTemp['leftSide'])
        stage.addChild(tileTemp['rightSide'])
        widthPositionTracker += tileWidth
      }
      heightPositionTracker += tileHeight / 1.25 // increment
    }
  }

}
