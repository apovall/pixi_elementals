/* 
  Purpose: Module to 
    Generate initial map noise seed
    Generate initial map with multipass cellular automata

*/

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

  seedNoiseMap(buildableDensity:number): Array<Array<String>>{
    /*   
      args:
        buildableDensity: specifies whether an element will be 'buildable' or not. Treat as percentage.
      returns:
        noiseMap to act as a seed for cellular automaton
        for creating the initial map on which to build 
    */

    // Create 2D array[height[row]]
    let noiseMap:Array<Array<String>> = []
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
  applyCellularAutomaton(grid:Array<Array<String>>, count:number): Array<Array<String>>{
    /*
      args:
        grid - the incoming noise map
        count - number of times to loop through the cellular automaton algorithm
      returns:
        smoothed map for populating
    */
    console.log(grid);
    
    for(let runCount=0; runCount < count; runCount++){
      console.log('#1')
      console.log(grid)
      for(let passes=1; passes<=count; passes++){
        let tempGrid = grid // To not work use noiseMap as both input and output
        for(let heightSearch=1; heightSearch<this.screenHeight; heightSearch++){
          for(let widthSearch=1; widthSearch<this.screenWidth; widthSearch++){
            let neighbourWallCount:number = 0
            for(let heightBounds = heightSearch - 1; heightBounds<=heightSearch+1; heightBounds++ ){
              for(let widthBounds = widthSearch - 1; widthBounds<=widthSearch+1; widthBounds++){
                if(this.checkMapBoundary(heightBounds,widthBounds)){
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
              grid[heightSearch][heightSearch] = this.wallTile
            }else{
              grid[heightSearch][heightSearch] = this.floorTile
            }
          }
        }
      }
    }  
    console.log('#2');
    console.log(grid);
      
    return grid
  }

  checkMapBoundary(searchBounds:number, widthBounds:number):Boolean{
    try {
      if(searchBounds <= -1 || searchBounds > this.screenHeight){
        return false
      }
      if(widthBounds <=-1 || widthBounds > this.screenWidth){
        return false
      }
      return true    
    } catch (error) {
      return false
    }
  }

  // growth_check(map): newMap


  
}
