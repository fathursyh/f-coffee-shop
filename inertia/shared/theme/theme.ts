import {
  Button,
  createTheme,
  Menu,
  Paper,
  PasswordInput,
  TextInput,
  type MantineColorsTuple,
} from '@mantine/core'

import menuClasses from './Menu.module.css'

const coffee: MantineColorsTuple = [
  '#fdfaf7',
  '#f5ede4',
  '#e6d4c3',
  '#d5b99f',
  '#be9975',
  '#9c7753',
  '#7a593b',
  '#5c3a21',
  '#472b16',
  '#321e10',
]

export const theme = createTheme({
  fontSmoothing: true,
  primaryColor: 'coffee',
  primaryShade: { light: 7, dark: 6 },
  colors: {
    coffee,
  },
  headings: {
    fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
    sizes: {
      h1: { fontWeight: '800' },
    },
  },
  defaultRadius: 'md',
  components: {
    Menu: Menu.extend({
      classNames: menuClasses,
    }),

    Paper: Paper.extend({
      defaultProps: {
        radius: 'lg',
        shadow: 'xl',
        withBorder: true,
      },
      styles: (th) => ({
        root: {
          borderColor: th.colors.coffee[2],
        },
      }),
    }),

    TextInput: TextInput.extend({
      defaultProps: {
        radius: 'md',
      },
      styles: (th) => ({
        label: {
          color: th.colors.coffee[9],
          fontWeight: 600,
          marginBottom: 4,
        },
        input: {
          borderColor: th.colors.coffee[2],
        },
      }),
    }),

    PasswordInput: PasswordInput.extend({
      defaultProps: {
        radius: 'md',
      },
      styles: (th) => ({
        label: {
          color: th.colors.coffee[9],
          fontWeight: 600,
          marginBottom: 4,
        },
        input: {
          borderColor: th.colors.coffee[2],
        },
      }),
    }),

    Button: Button.extend({
      defaultProps: {
        radius: 'md',
        size: 'md',
        color: 'coffee',
      },
    }),
  },
})
