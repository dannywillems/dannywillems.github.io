<ul>
{% assign postsByYearMonth = site.posts | group_by_exp:"post", "post.date | date: '%Y'"  %}
{% for yearMonth in postsByYearMonth %}
  <h3>{{ yearMonth.name }}</h3>
    <ul>
      {% for post in yearMonth.items %}
        <li><a href="{{ post.url }}">{{ post.date | date: '%B %d, %Y'}} - {{ post.title }}</a></li>
      {% endfor %}
    </ul>
<br />
{% endfor %}
</ul>
