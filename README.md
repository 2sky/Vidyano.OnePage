# Vidyano OnePage

The Vidyano OnePage package allows you to transform the develop Vidyano layout into a OnePage layout.
Routes will be treated as individual pages.

### 1. Install bower package
```
$ bower install vidyano.onepage --save
```

### 2. Import the one-page-wrapper component in your html file
```html
<link rel="import" href="bower_components/vidyano.onepage/one-page-wrapper.html" />
```

### 3. Override the default vi-app template
```html
<vi-app class="fit">
    <template is="dom-template">
        <vi-one-page-wrapper class="fit">
            <a slot="navigation" href="">Page 1</a>
            <a slot="navigation" href="page2">Page 2</a>
            ...
        </vi-one-page-wrapper>
    </template>

    <vi-app-route route=""><template is="dom-template"><sample-page n="1"></sample-page></template></vi-app-route>
    <vi-app-route route="page2"><template is="dom-template"><sample-page n="2"></sample-page></template></vi-app-route>
    ...
</vi-app>
```

## Credit
This package is based on the awesome [Swiper](https://github.com/nolimits4web/Swiper) library.
