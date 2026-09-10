import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Coffee from '#models/coffee'

export default class extends BaseSeeder {
  async run() {
    await Coffee.updateOrCreateMany('id', [
      {
        id: 'guji-highland-flora',
        name: 'Guji Highland Flora',
        origin: 'Ethiopia',
        subregion: 'Uraga, Guji Zone',
        elevation: '2,150 MASL',
        process: 'Natural / Slow Sun-Dried',
        roast: 'Light',
        roastLevel: 1.5,
        tastingNotes: ['Bergamot', 'Wild Peach', 'Jasmine Blossom', 'Orange Blossom Honey'],
        description:
          'Silky, tea-like clarity with floral sweetness and lingering nectarine juiciness. Handpicked heirloom varietals grown by smallholders in dense shade.',
        bestFor: 'V60, Chemex, Aeropress',
        basePrice250G: 19.5,
        badge: "Roaster's Pick",
      },
      {
        id: 'finca-la-esperanza',
        name: 'Finca La Esperanza',
        origin: 'Colombia',
        subregion: 'San Adolfo, Huila',
        elevation: '1,780 MASL',
        process: 'Honey Process / Caturra',
        roast: 'Medium-Light',
        roastLevel: 2.5,
        tastingNotes: ['Milk Chocolate', 'Red Gala Apple', 'Toasted Almond', 'Cane Sugar'],
        description:
          'The quintessential comfort cup with a bright, crisp apple acidity balanced by warm panela sugar and milk chocolate body.',
        bestFor: 'Pour Over, Drip, Flat White',
        basePrice250G: 18.0,
        badge: 'Seasonal Lot',
      },
      {
        id: 'antigua-los-volcanes',
        name: 'Antigua Los Volcanes',
        origin: 'Guatemala',
        subregion: 'Sacatepéquez Valley',
        elevation: '1,650 MASL',
        process: 'Fully Washed / Bourbon',
        roast: 'Medium',
        roastLevel: 3,
        tastingNotes: ['Spiced Caramel', 'Candied Orange', 'Dark Cocoa', 'Pecan'],
        description:
          'Grown in rich volcanic mineral soil beneath Agua and Fuego volcanoes. Round mouthfeel, sweet citrus aromatics, and a warm caramel finish.',
        bestFor: 'French Press, Moka Pot, Drip',
        basePrice250G: 17.5,
        badge: 'Everyday Classic',
      },
      {
        id: 'sumatra-gayo-mountain',
        name: 'Sumatra Gayo Highlands',
        origin: 'Indonesia',
        subregion: 'Takengon, Aceh',
        elevation: '1,500 MASL',
        process: 'Traditional Wet-Hulled (Giling Basah)',
        roast: 'Medium-Dark',
        roastLevel: 4,
        tastingNotes: ['Dark Forest Honey', 'Cedarwood', 'Baking Spice', 'Cacao Nibs'],
        description:
          'Deep, syrupy, and exceptionally low in perceived acidity. Cultivated by organic smallholders under native shade trees in northern Sumatra.',
        bestFor: 'French Press, Cold Brew, Espresso',
        basePrice250G: 18.5,
        badge: null,
      },
      {
        id: 'hearthstone-house-blend',
        name: 'Hearthstone Espresso Blend',
        origin: 'Brazil & Ethiopia Blend',
        subregion: 'Cerrado Mineiro & Sidama',
        elevation: '1,100 - 1,900 MASL',
        process: 'Pulped Natural & Washed',
        roast: 'Dark',
        roastLevel: 4.5,
        tastingNotes: ['Fudge Truffle', 'Dark Molasses', 'Roasted Hazelnut', 'Warm Crema'],
        description:
          'Our house cornerstone blend. Formulated to slice through steamed milk with velvety cocoa density, or yield thick, viscous straight shots.',
        bestFor: 'Espresso Machine, Moka Pot, Cold Brew',
        basePrice250G: 16.5,
        badge: 'Flagship Blend',
      },
      {
        id: 'cauca-sugarcane-decaf',
        name: 'Cauca Valley Nightcap Decaf',
        origin: 'Colombia',
        subregion: 'Inzá, Cauca',
        elevation: '1,700 MASL',
        process: 'EA Sugarcane Natural Decaf',
        roast: 'Medium',
        roastLevel: 3,
        tastingNotes: ['Brown Sugar', 'Graham Cracker', 'Red Cherry', 'Malted Toffee'],
        description:
          'Naturally decaffeinated using fermented molasses from local Colombian sugarcane. Retains 100% of the origin terroir with none of the late-night jitters.',
        bestFor: 'Any Brewing Method',
        basePrice250G: 18.0,
        badge: 'Caffeine-Free',
      },
    ])
  }
}
