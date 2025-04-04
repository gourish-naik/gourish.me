use of carousal card

```js
import CarouselCard from './CarouselCard'

const projectImages = [
  {
    image: '/images/project1.png',
    href: '/projects/ecommerce-store',
  },
  {
    image: '/images/project2.png',
    href: '/projects/finance-tracker',
  },
]

<div className="keen-slider">
  {projectImages.map((item, i) => (
    <div key={i} className="keen-slider__slide p-2">
      <CarouselCard {...item} />
    </div>
  ))}
</div>
```

