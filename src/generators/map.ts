/* 
  Purpose: Module to 
    Generate initial map noise seed
    Generate initial map with multipass cellular automata

*/
import _ from 'lodash';

type NoiseMap = Array<Array<String>>
export class MapGenerator{

  private readonly screenWidth: number
  private readonly screenHeight: number
  private readonly floorTile: string
  private readonly wallTile: string
  private readonly wallCountThreshold: number

  // constructor( height, width)
  constructor(screenWidth:number, screenHeight:number,){
    this.screenHeight = screenHeight
    this.screenWidth = screenWidth
    this.floorTile = '.'
    this.wallTile = 'x'
    this.wallCountThreshold = 4
  }

  seedNoiseMap(buildableDensity:number): NoiseMap{
    /*   
      args:
        buildableDensity: specifies whether an element will be 'buildable' or not. Treat as percentage.
      returns:
        noiseMap to act as a seed for cellular automaton
        for creating the initial map on which to build 
    */

    // Create 2D array[height[row]]
    let noiseMap:NoiseMap = []
    // const p = [...noiseMap]
    console.log(noiseMap);
    // Cycle through the array to create a random noise map
    for(let height=0; height<this.screenHeight; height++){
      noiseMap.push([])
      for(let width=0; width<this.screenWidth; width++){
        if(Math.random() <= buildableDensity){
          noiseMap[height].push(this.floorTile) //Floor tile
        }
        else{
          noiseMap[height].push(this.wallTile) //Wall tile
        }
      }
    }
    return noiseMap
  }
  // cellular_automata procedural smoothing (seedMap, passes): map
  applyCellularAutomaton(grid:NoiseMap, count:number): NoiseMap{
    /*
      args:
        grid - the incoming noise map
        count - number of times to loop through the cellular automaton algorithm
      returns:
        smoothed map for populating
    */
    for(let runCount=0; runCount < count; runCount++){
      let neighbourWallCount:number

      for(let passes=0; passes<count; passes++){
        let tempGrid = _.cloneDeep(grid) // To not work use noiseMap as both input and output
        // let p = [...grid.map(x => [...x])]
        for(let heightSearch=0; heightSearch<this.screenHeight; heightSearch++){
          for(let widthSearch=0; widthSearch<this.screenWidth; widthSearch++){
            neighbourWallCount = 0
            for(let heightBounds = heightSearch - 1; heightBounds<=heightSearch + 1; heightBounds++ ){              
              for(let widthBounds = widthSearch - 1; widthBounds<=widthSearch + 1; widthBounds++){
                console.log(`y:${heightSearch}, x: ${widthSearch}`, `y-search: ${heightBounds}, x-search: ${widthBounds}`);
                if(this.checkMapBoundary(heightBounds, widthBounds)){
                  // Check if search item is not equal to the current cell
                  if(heightBounds != heightSearch || widthBounds != widthSearch){
                      if(tempGrid[heightBounds][widthBounds] == this.wallTile){
                        neighbourWallCount++                                
                      }
                  }
                }else{
                  neighbourWallCount++
                }
              }
            }           
            if(neighbourWallCount > this.wallCountThreshold){
              grid[heightSearch][widthSearch] = this.wallTile
              // console.log('assigning floor', this.wallTile, neighbourWallCount);     
            }else{
              grid[heightSearch][widthSearch] = this.floorTile
              // console.log('assigning floor', this.floorTile, neighbourWallCount);
            }
          }
        }
      }
    }  
    // console.log('#2');
    console.log(grid, Date());
      
    return grid
  }

  checkMapBoundary(heightBounds:number, widthBounds:number):Boolean{

    if(heightBounds <= -1 || heightBounds > this.screenHeight-1){
      return false
    }
    if(widthBounds <=-1 || widthBounds > this.screenWidth-1){
      return false
    }
    return true    
    
  }

  // growth_check(map): newMap


  
}
