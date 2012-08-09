$(function (){
	prettyPrint();

	$('#slider1').felixSlider({
		auto: true,
		rolling: true
	});

	$('#example1').felixSlider();
	$('#example2').felixSlider({
		auto: true,
		rolling: true
	});
	$('#example3').felixSlider({
		auto: true,
		autoReverse: true,
		rolling: true
	});
	$('#example4').felixSlider({
		auto: true,
		rolling: true,
		intervalType: 'image'
	});
	$('#example5').felixSlider({
		auto: true,
		rolling: true,
		showImageCount: 3
	});
	$('#example6').felixSlider({
		auto: true,
		rolling: true,
		padding: 0
	});
	$('#example7').felixSlider({
		auto: true,
		rolling: true,
		direction: 'V'
	});
	$('#example8').felixSlider({
		auto: true,
		rolling: true,
		showImageCount: 3,
		buttonShow: false
	});
	$('#ex8-pre').click(function (){
		$('#example8').felixSlider('previous');
	});
	$('#ex8-next').click(function (){
		$('#example8').felixSlider('next');
	});
	$('#example9').felixSlider({
		auto: true,
		rolling: true,
		showImageCount: 3,
		imageClick: function (target){
			$('#ex9-preview').empty();
			$('#ex9-preview').append(target);
		}
	});
	$('#example10').felixSlider({
		auto: true,
		rolling: true,
		showImageCount: 1,
		buttonShow: false,
		padding: 0
	});
	$('#example11').felixSlider({
		auto: true,
		rolling: true,
		showImageCount: 1,
		buttonShow: false,
		direction: 'V',
		padding: 0
	});
	$('ul.nav').on('click.active', 'li', function (){
		$(this).parent().children().removeClass('active');
		$(this).addClass('active');
	});
	$('.brand').click(function (){
		$('ul.nav').children().removeClass('active');
	});
});