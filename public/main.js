"use strict";

// WEBGL FUNDAMENTALS EXPLORATION SECTION : HOW IT WORKS?

function draw(id, number_of_vertices) {
  // Get canvas number
  var no;
  if (id == "c1") {
      no = 1;
  } else if (id == "c2"){
      no = 2;
  } else if (id == "c3"){
     no = 3;
  } else{
      no = 4;
  }
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#"+id);
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getAttribLocation(program, "a_color");

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer for positions.
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  if (number_of_vertices == 3){
    var coordinates = [
        0, -100,
      150,  125,
     -175,  100]
  } else { // number_of_vertices = 6
    var coordinates = [
        -150, -100,
         150, -100,
        -150,  100,
         150, -100,
        -150,  100,
         150,  100]
  }
  // Set Geometry.
  setGeometry(gl, coordinates);

  // Create a buffer for the colors.
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  
  if (no == 1){
    // Triangle with one color

    var r1 = Math.random();
    var b1 = Math.random();
    var g1 = Math.random();

    var colorArray = 
    [r1, b1, g1, 1,
    r1, b1, g1, 1,
    r1, b1, g1, 1]

    setColors(gl, colorArray);
  } else if (no == 2){
    // Triangle with random color on each vertices

    // Set the colors by pick 3 random colors on each vertex
    var colorArray = 
    [Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1]

    setColors(gl, colorArray);
  } else if (no == 3){
    // 2 triangle with 1 random color on each triangle.

    var r1 = Math.random();
    var b1 = Math.random();
    var g1 = Math.random();
    var r2 = Math.random();
    var b2 = Math.random();
    var g2 = Math.random();

    var colorArray = 
    [r1, b1, g1, 1,
    r1, b1, g1, 1,
    r1, b1, g1, 1,
    r2, b2, g2, 1,
    r2, b2, g2, 1,
    r2, b2, g2, 1]

    setColors(gl, colorArray);
  } else{
    // Set the colors.

    // Pick 6 random colors on each vertex

    var colorArray = 
    [Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1,
    Math.random(), Math.random(), Math.random(), 1]

    setColors(gl, colorArray);

  }

  var translation = [200, 150];
  var angleInRadians = 0;
  var scale = [1, 1];

  drawScene();

  // Setup a ui.
  webglLessonsUI.setupSlider("#x"+no, {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y"+no, {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
  webglLessonsUI.setupSlider("#angle"+no, {slide: updateAngle, max: 360});
  webglLessonsUI.setupSlider("#scaleX"+no, {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider("#scaleY"+no, {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    angleInRadians = angleInDegrees * Math.PI / 180;
    drawScene();
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }

  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    

    // Turn on the color attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 4;          // 4 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset);
    

    // Compute the matrix
    var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = m3.translate(matrix, translation[0], translation[1]);
    matrix = m3.rotate(matrix, angleInRadians);
    matrix = m3.scale(matrix, scale[0], scale[1]);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = number_of_vertices;
    gl.drawArrays(primitiveType, offset, count);
  }
}

// Fill the buffer with the values that define a triangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setGeometry(gl, coordinates) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(coordinates),
      gl.STATIC_DRAW);
}

function setColors(gl, colorArray){

  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        colorArray),
      gl.STATIC_DRAW);
}


// IMAGE PROCESSING EXPLORATION SECTION

function loadImage(id_canvas, url){
  // loading image
  var image = new Image();
  image.src = url; 

  // callback when image already loaded
  image.onload = function() {
    renderImage(id_canvas, image);
  };
}

function renderImage(id_canvas, image) {
  // Get render type number
  var no = parseInt(id_canvas.charAt(1)) - 4;

    // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#"+id_canvas);
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-img-2d", "fragment-shader-img"+no+"-2d"]);

  // look up where the position data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer to put three 2d clip space points in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, image.width, image.height);

  // look up where the texture data needs to go.
  var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // provide texture coordinates for the rectangle.
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
  ]), gl.STATIC_DRAW);

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");

  if (no == 4){
    // using kernel

    // look up where the kernel data needs to go.
    var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
    var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
  
    // Define several convolution kernels
    var kernels = {
      normal: [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
      ],
      gaussianBlur: [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045
      ],
      gaussianBlur2: [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
      ],
      gaussianBlur3: [
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
      ],
      unsharpen: [
        -1, -1, -1,
        -1,  9, -1,
        -1, -1, -1
      ],
      sharpness: [
         0,-1, 0,
        -1, 5,-1,
         0,-1, 0
      ],
      sharpen: [
         -1, -1, -1,
         -1, 16, -1,
         -1, -1, -1
      ],
      edgeDetect: [
         -0.125, -0.125, -0.125,
         -0.125,  1,     -0.125,
         -0.125, -0.125, -0.125
      ],
      edgeDetect2: [
         -1, -1, -1,
         -1,  8, -1,
         -1, -1, -1
      ],
      edgeDetect3: [
         -5, 0, 0,
          0, 0, 0,
          0, 0, 5
      ],
      edgeDetect4: [
         -1, -1, -1,
          0,  0,  0,
          1,  1,  1
      ],
      edgeDetect5: [
         -1, -1, -1,
          2,  2,  2,
         -1, -1, -1
      ],
      edgeDetect6: [
         -5, -5, -5,
         -5, 39, -5,
         -5, -5, -5
      ],
      sobelHorizontal: [
          1,  2,  1,
          0,  0,  0,
         -1, -2, -1
      ],
      sobelVertical: [
          1,  0, -1,
          2,  0, -2,
          1,  0, -1
      ],
      previtHorizontal: [
          1,  1,  1,
          0,  0,  0,
         -1, -1, -1
      ],
      previtVertical: [
          1,  0, -1,
          1,  0, -1,
          1,  0, -1
      ],
      boxBlur: [
          0.111, 0.111, 0.111,
          0.111, 0.111, 0.111,
          0.111, 0.111, 0.111
      ],
      triangleBlur: [
          0.0625, 0.125, 0.0625,
          0.125,  0.25,  0.125,
          0.0625, 0.125, 0.0625
      ],
      emboss: [
         -2, -1,  0,
         -1,  1,  1,
          0,  1,  2
      ]
    };
    var initialSelection = 'edgeDetect2';
  
    // Setup UI to pick kernels.
    var ui = document.querySelector("#kernel");
    var select = document.createElement("select");
    for (var name in kernels) {
      var option = document.createElement("option");
      option.value = name;
      if (name === initialSelection) {
        option.selected = true;
      }
      option.appendChild(document.createTextNode(name));
      select.appendChild(option);
    }
    select.onchange = function(event) {
      draw(this.options[this.selectedIndex].value);
    };
    ui.appendChild(select);
    draw(initialSelection);
    } else{
    draw();
  }

  function draw(name = -1){
    // name = -1 if not using kernel

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
  
    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);
  
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);
  
    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);
  
    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  
    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset);
  
    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  
    // set the size of the image
    gl.uniform2f(textureSizeLocation, image.width, image.height);
  
    if (no == 4){
        // set the kernel and it's weight
        gl.uniform1fv(kernelLocation, kernels[name]);
        gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name])); 
    }
  
    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);  
  }

}

function computeKernelWeight(kernel) {
  var weight = kernel.reduce(function(prev, curr) {
      return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}



// CALL FUNCTION
draw("c1", 3);
draw("c2", 3);
draw("c3", 6);
draw("c4", 6);
loadImage("c5", `picture/flower.jpg`);
loadImage("c6", `picture/flower.jpg`);
loadImage("c7", `picture/flower.jpg`);
loadImage("c8", `picture/flower.jpg`);