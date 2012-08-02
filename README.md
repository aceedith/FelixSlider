# FelixSlider
FelixSlider is image slider plug-in of jQuery.

## Usage
### HTML
```html
<ul id="slider">
	<li>
		<img src="http://www.agentsdata.com.au/data/21/539/2577.jpg" width="120" height="80" />
	</li>
	<li>
		<img src="http://www.agentsdata.com.au/data/21/539/2578.jpg" width="120" height="80" />
	</li>
	<li>
		<img src="http://www.agentsdata.com.au/data/21/539/2579.jpg" width="120" height="80" />
	</li>
	<li>
		<img src="http://www.agentsdata.com.au/data/21/539/2580.jpg" width="120" height="80" />
	</li>
	<li>
		<img src="http://www.agentsdata.com.au/data/21/539/2581.jpg" width="120" height="80" />
	</li>
</ul>
```

### Javascript
Applying
```Javascript
$('#slider').felixSlider();
```
Applying by options
```Javascript
$('#slider').felixSlider({
	direction: 'H', // image listing direction V : Vertical, H : Horizental
	showImageCount: 5, // image view count
	padding: 2, // padding
	preClick: null, // function (state) {} : state is success or failure of moving
	nextClick: null, // function (state) {} : state is success or failure of moving
	imageClick: null, // function (target) {} : target is clicked image
	preHtml: null, // preButton design html
	nextHtml: null, // nextButton design html
	intervalType: 'show' // 'show' is to move imagesBox, 'image' is to move one image.
});
```
Changing option
```Javascript
$('#slider').felixSlider('option', 'direction', 'V');
$('#slider').felixSlider('option', 'padding', 30);
$('#slider').felixSlider('option', 'showImageCount', 2);
$('#slider').felixSlider('option', 'intervalType', 'image');
```
Changing option
```Method
$('#slider').felixSlider('destroy'); // Destroying FelixSlider
```