window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function(){
	var canvas, ctx,
		fps = 24,
		cellColor = "#808080",
		gridSize = 8,
		grid = [];

	function onDocumentReady(){
		canvas = document.getElementById("conway");
		ctx = canvas.getContext("2d");

		window.addEventListener("resize", resize);
		document.addEventListener("mousemove", onMouseMove);

		resize();
		randomizeGrid();
		drawLoop();
	}

	function onMouseMove(e)
	{
		var x = Math.floor(e.pageX / gridSize), 
			y = Math.floor(e.pageY / gridSize);

		grid[y][x] = 1;
	}

	function drawLoop(){
		setTimeout(function(){
			requestAnimFrame(drawLoop);
			updateGrid();
			renderGrid();
		}, (1000 / fps));
	}

	function resize(){
		resizeCanvas();	
		resizeGrid();
	}

	function resizeCanvas(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function resizeGrid(){
		var i, 
			row,
			columns = Math.ceil(canvas.width / gridSize),
			rows = Math.ceil(canvas.height / gridSize);

		if(grid.length > rows)
		{
			grid.length = rows;
		}
		else
		{
			for(i=0; i<grid.length; i++){
				row = grid[i];
				if(row.length > columns)
				{
					row.length = columns;
				}
				else
				{
					while(row.length < columns){
						row.push(0);
					}
				}
			}

			while(grid.length < rows){
				grid.push(new Array(columns));
			}
		}
	}

	function updateGrid(){
		var x, y, neighbors, newGrid = [], rows = grid.length, cols = grid[0].length;

		for(y=0; y<rows; y++)
		{
			newGrid[y] = new Array(cols);
			for(x=0; x<cols; x++)
			{
				neighbors = livingNeighbors(x, y);

				if(grid[y][x])
				{
					if(neighbors < 2 || neighbors > 3)
					{
						// If a cell is alive, but has less than 2 
						// or more than 3 living neighbors, it dies.
						newGrid[y][x] = 0;
					}
					else
					{
						// But if it has 2 or 3 living neighbors it stays alive.
						newGrid[y][x] = 1;
					}

				}
				else if(neighbors === 3)
				{
					// If a cell is dead, but has three living neighbors, it comes to life.
					newGrid[y][x] = 1;
				}
			}
		}

		grid = newGrid;
	}

	function randomizeGrid(){
		var x, y, rows = grid.length, cols = grid[0].length;

		for(y=0; y<rows; y++)
		{
			for(x=0; x<cols; x++)
			{
				grid[y][x] = Math.floor(Math.random() * 2);
			}
		}
	}

	function livingNeighbors(x, y){
		var ret = 0;
		if(grid[y-1])
		{
			ret += Number(!!grid[y - 1][x - 1]);
			ret += Number(!!grid[y - 1][x]);
			ret += Number(!!grid[y - 1][x + 1]);
		}
		ret += Number(!!grid[y][x - 1]);
		ret += Number(!!grid[y][x + 1]);
		if(grid[y + 1])
		{
			ret += Number(!!grid[y + 1][x - 1]);
			ret += Number(!!grid[y + 1][x]);
			ret += Number(!!grid[y + 1][x + 1]);
		}

		return ret;
	}

	function renderGrid(){
		var x, y, drawY, rows = grid.length, cols = grid[0].length, cell;

		canvas.width = canvas.width;
		ctx.fillStyle = cellColor;
		for(y=0; y<rows; y++)
		{
			drawY = gridSize * y;
			for(x=0; x<cols; x++)
			{
				if(grid[y][x])
				{
					ctx.rect(gridSize * x, drawY, gridSize, gridSize);
				}
			}
		}
		ctx.fill();
	}

	document.addEventListener("DOMContentLoaded", onDocumentReady);
})();