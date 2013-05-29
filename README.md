jquery.bulletchart
==================

A bullet chart plugin for jquery based on the bullet charts used in Team Foundation Server.

![Screenshot](http://s2.postimg.org/84hux4jbt/Samples.png)

Configuration Defaults / Options
================================

* `title: string (optional)` - title that will be added to the chart.
* `subtitleFormat: string (optional) (default: ' of {1}h)` - subtitle format that is applied to the subtitle. It uses the same formatting for string in C# (eq: `'Hello {0}, this is my subtitle for {1}.'`)
* `animate: boolean (default: true)` - true if you want the chart to animate when it is shown.
* `current: float (required)` - the current value
* `total: float (required)` - the total (estimated) value
* `baseline: float (optional)` - a given baseline

Examples
========

The html:
```
<div class="row">
    <div class="span5">
        <div id="simple-bulletchart"></div>
    </div>

    <div class="span5">
        <div id="advanced-bulletchart"></div>
    </div>
</div>
```

<b>A simple bullet chart</b>

```
$('#simple-bulletchart').bulletChart({
    title: 'total > current',
    current: 35.5,
    total: 45
});
```

<b>An advanced bullet chart</b>
```
$('#advanced-bulletchart').bulletChart({
    title: 'baseline > total > current',
    subtitleFormat: 'of {0} hours with a baseline of {1}',
    current: 32,
    total: 38,
    baseline: 42
});
```
