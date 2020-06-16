<template>
  <div class="methodology--paragraph paragraph">
    <h3 class="heading-tertiary">Methodology</h3>
    <br>
    <h4>The purpose</h4>
    <p>
      The intent of this visualization is, on the one hand, to show general information on suicides in the world (numbers, gender, age) and on the other
      to understand if factors such as happiness and the GDP of a country can affect the number of suicides.
    </p>
    <h4>Datasets</h4>
    <p>
      The data are available at the following links:
      <ul>
        <li>
          <a href="https://www.kaggle.com/russellyates88/suicide-rates-overview-1985-to-2016">Suicide Rates Overview 1985 to 2016</a>
        </li>
        <li>
          <a href="https://www.kaggle.com/unsdsn/world-happiness#2019.csv">World Happiness Report</a>
        </li>
      </ul>
      <br>
      As regards the first dataset, some premises must be made regarding data quality.
      The dataset was collected by putting together the data of the World Health Organization in 2018. WHO assigns to each country a level of quality,
      and therefore of reliability of the data. The WHO reports that, of its 183 Member States for which suicide estimates are published, only 80 have good-quality vital
      registration data that can be used directly to estimate suicide rates (for more information see the WHO’s
      <a href="https://www.who.int/mental_health/suicide-prevention/mortality_data_quality/en/">Quality of suicide mortality data</a>).
      <br>
      The second dataset is instead a collection of different World Happiness Reports published annually by the United Nations Sustainable Development Solutions Network.
      The happiness scores and rankings use data from the <a href="https://news.gallup.com/poll/105226/world-poll-methodology.aspx">Gallup World Poll</a>.
      The scores are based on answers to the main life evaluation question asked in the poll. This question, known as the Cantril ladder, asks respondents to think of a ladder
      with the best possible life for them being a 10 and the worst possible life being a 0 and to rate their own current lives on that scale.
      The scores are from nationally representative samples for the years 2013-2016 and use the Gallup weights to make the estimates representative.
      <!-- The rankings of national happiness are based on a Cantril ladder survey. Nationally representative samples of respondents are asked to think of a ladder,
      with the best possible life for them being a 10, and the worst possible life being a 0. They are then asked to rate their own current lives on that 0 to 10 scale.
      The report correlates the results with various life factors. -->
    </p>
    <h4>The map</h4>
    <p>
      The first dataset consists of the number of suicides each year in a given country, split by sex and age groups, plus the total population in according group,
      thus allowing us to calculate the crude rates per 100k people. The use of rates seems obvious, as the sheer number of suicides corresponds to the size of the population:
      the bigger the country, the more suicides.
      The map shows the rates of each individual country per year.
    </p>
    <h4>Total world suicides per year</h4>
    <p>
      For each year the total number of suicides is shown, then divided by gender and age group.
    </p>
    <h4>Trend suicides per country</h4>
    <p>
      Suicide numbers by country over the years are shown.
    </p>
    <h4>Relation suicides/happiness in 2015</h4>
    <p>
      The relationship between suicides and happiness of the various countries in 2015 is shown.
    </p>
    <h4>Relation suicides/gdp per year</h4>
    <p>The relationship between suicides and GDP of the various countries over the years is shown.</p>
  </div>
</template>
