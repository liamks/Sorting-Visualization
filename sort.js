/*
Sorting Animations
Liam D. Kaufman
July 2011

Many of the settings defined at the top of this document
could be used to enable the user to define the number
of elements in the list and their colors.

*/

function Sort(){};
/*container boxes are placed in. */
Sort.container = "#container";
/*Total number of boxes */
Sort.num_boxes = 32;
Sort.boxes = [];

/* These are used for bubble sort */
Sort.intervalID = 0;
Sort.i = 0;
Sort.j = 0;

/*
The Box class is used to visually represent an item in a list,
where its height is the attribute it is sorted on. A color
gradient is included to make the boxes stand out more.
*/
function Box(x,height,lightness){
  this.x = x;
  this.height = height;
  this.color = "hsl(220,100%, " + lightness+ "%)";
  this.div = $("<div>")
    .addClass("box")
    .css({
      "height":height,
      "left": x
      });
  this.setBG(true);
};

/*
setBG sets the background gradient for a given box.
*/
Box.prototype.setBG = function(swapped){
  $(this.div).css({
      "background": "-webkit-gradient(linear, left top, left bottom, from(" +this.color+"), to(#0c233a))"
  })
}

/*
draw appends the box to the container element.
*/
Box.prototype.draw = function(){
  $(Sort.container).append(this.div)
}

/*
updateX is used to modify the x offset of a box.
Once the x is modified, jQuery's animate function is 
called to move the box to its new x offset.
*/
Box.prototype.updateX = function(new_x){
  this.x = new_x;
  //$(this.div).css("left", new_x);
  $(this.div).animate({"left": new_x}, 30);
}

/*
Sort.swap function takes indices i and j and swaps
them in the array this.boxes and swaps their x
offset.
*/

Sort.swap = function(i,j){
  var temp = this.boxes[i];
  var x = temp.x
  this.boxes[i] = this.boxes[j];
  this.boxes[j] = temp;
  this.boxes[j].updateX(this.boxes[i].x);
  this.boxes[i].updateX(x);
}

/*
Sort.mix pseudo-randomizes the order of this.boxes
by repeatedly swapping 2 randomly selected elements.
*/
Sort.mix = function(){
  for(var i = 0; i< (this.num_boxes * 4); i++){
    index_i = Math.floor(Math.random() * this.num_boxes);
    index_j = Math.floor(Math.random() * this.num_boxes);
    this.swap(index_i,index_j);
  }
}


/*
  bubblerR is repeatedly called by bubble.
  Each time it is called it compares to elements
  and makes a swap if necessary.
*/
Sort.bubbleR = function(){
  first_box = Sort.boxes[Sort.j];
  second_box = Sort.boxes[Sort.j + 1];

  if(second_box.height < first_box.height){
      Sort.swap(Sort.j,Sort.j+1);
  }

  Sort.j ++;

  if(Sort.j == Sort.num_boxes - Sort.i - 1){
    Sort.i ++;
    Sort.j = 0;
    if(Sort.i == Sort.num_boxes - 1){
      clearInterval(Sort.intervalID);
      Sort.j = 0;
      Sort.i = 0;
    }
  }

}

/*
bubble is a wrapper function that repeatedly calls
bubbleR every 30 milliseconds.
*/
Sort.bubble = function(){
  Sort.intervalID = setInterval(Sort.bubbleR, 30);
}


/*
partition is a port of the pseudo code from wikipedia's
quicksort page: http://en.wikipedia.org/wiki/Quicksort#In-place_version
*/
Sort.partition = function(left, right){

  pivot_value = Sort.boxes[left].height;
  Sort.swap(left,right - 1) //move pivot to end
  store_index = left;
  
  for(var i = left; i < right; i++){
    if(Sort.boxes[i].height < pivot_value){
      Sort.swap(i,store_index);
      store_index += 1;
    }
  }
  Sort.swap(store_index,right - 1);
  return store_index;
}

/*
quicksort sorts the Sort.boxes using quicksort. It 
recursively partitions the array, thereby sorting
it in nlogn time.
*/
Sort.quicksort = function(left, right){

  if(right - left <= 1){
    return
  }
  var part_i = Sort.partition(left, right)

  setTimeout(Sort.quicksort(left, part_i), 500)
  setTimeout(Sort.quicksort(part_i + 1, right), 500)

}

$(document).ready(function(){
  //Dynamically determine size of container
  $(Sort.container).css({
    width: (Sort.num_boxes * 25) + 8,
    height: (Sort.num_boxes * 10) + 10,
  })

  //Create boxes and draw them
  for(var i=1;i<= Sort.num_boxes;i++){
    lightness = (100 - (2.5 * i))/100 * 100
    Sort.boxes[i - 1] = new Box((25 * (i - 1)) + 5, 10 * i, lightness);
    Sort.boxes[i - 1].draw();
  }

  //add event handlers to 3 buttons
  $("#mix").click(function(){Sort.mix()});
  $("#bubble").click(function(){Sort.bubble()});
  $("#quick").click(function(){Sort.quicksort(0,Sort.boxes.length)});
})
