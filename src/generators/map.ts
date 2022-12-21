/* 
  Purpose: Module to 
    Generate initial map noise seed
    Generate initial map with multipass cellular automata

*/

export class MapGenerator{

  private readonly width: number
  private readonly height: number

  // constructor( height, width)
  constructor(width:number, height:number,){
    this.height = height
    this.width = width
  }

  seedNoiseMap(buildableDensity:number): Array<Array<Boolean>>{
    // buildableDensity specifies whether an element will be 'buildable' or not
    // for creating the initial map on which to build
    // Create 2D array[height[row]]
    let noiseMap:Array<Array<Boolean>> = []
    // Cycle through the array to create a random noise map
    for(let height:number=0; height<this.height; height++){
      noiseMap.push([])
      for(let width:number=0; width<this.width; width++){
        if(Math.random() >= buildableDensity){
          noiseMap[height].push(true)
        }
        else{
          noiseMap[height].push(false)
        }
      }
    }
    console.log(noiseMap)

    return noiseMap
  }
  // cellular_automata procedural smoothing (seedMap, passes): map
  // growth_check(map): newMap
}
