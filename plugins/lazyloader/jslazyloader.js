function script(url) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    var x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
}

/**
How to use this
add this before closing body tag of your pageTitle
<script>
script('http://yoursite.com/your-script.js');
script('http://yoursite.com/my-script.js');
script('http://yoursite.com/third-party-script.js');
</script>
**/
