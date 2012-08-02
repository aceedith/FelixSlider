# FelixSlider
FelixSlider is image slider plug-in of jQuery.

## Usage
### HTML
```html
<ul id="slider">
	<li>
		<img src="http://www.imagegood.co.kr/web_small/25/20120512153006.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/27/20120512154201.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/25/20120512152933.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/10/20111215063636.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/38/20111207075807.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/9/20111207075543.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/38/20111207074600.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/38/20111207074039.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/13/20111207073337.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/38/20111207072818.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/28/20111129052503.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/26/20111124003350.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/23/20111124001926.jpg" width="150" height="100" />
	</li>
	<li>
		<img src="http://www.imagegood.co.kr/web_small/23/20111124001038.jpg" width="150" height="100" />
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