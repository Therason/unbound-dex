export default async function fetchData() {
  const pokemon: any = {}

  const fetchNames = async () => {
    const rawData = (
      await fetch(
        'https://raw.githubusercontent.com/Skeli789/Complete-Fire-Red-Upgrade/dev/include/constants/species.h'
      ).then((res) => res.text())
    ).split('\n')

    rawData.forEach((line) => {
      const name = line.match(/#define *(SPECIES_\w+)/i)
      const id = line.match(/0[xX][0-9a-fA-F]+/i)

      // check line defines a pokemon species
      if (name && id) {
        // make name pretty
        const displayName = name[1]
          .split('_')
          .slice(1)
          .map((s) => s.toLowerCase())
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ')

        pokemon[name[1]] = {
          name: displayName,
          id: parseInt(id[0]),
        }
      }
    })
    console.log('pokermons')
  }

  // TODO: better variable names...
  const fetchStats = async () => {
    console.log('statssss')
    const rawData = (
      await fetch(
        'https://raw.githubusercontent.com/Skeli789/Dynamic-Pokemon-Expansion/Unbound/src/Base_Stats.c'
      ).then((res) => res.text())
    ).split('\n')

    // match stats
    const stats = [
      'baseHP',
      'baseAttack',
      'baseDefense',
      'baseSpeed',
      'baseSpDefense',
      'baseSpeed',
    ]
    const info = [
      'type1',
      'type2',
      'item1',
      'item2',
      'eggGroup1',
      'eggGroup2',
      'ability1',
      'ability2',
      'hiddenAbility',
    ]
    const reg = new RegExp(stats.concat(...info).join('|'))

    let name: string

    rawData.forEach((line) => {
      // check for species name
      const matchName = line.match(/SPECIES_\w+/i)
      if (matchName) {
        name = matchName[0]
      }

      const matchInfo = line.match(reg)
      if (matchInfo && name in pokemon) {
        let value
        if (stats.includes(matchInfo[0])) {
          // get base stats
          value = line.match(/\d+/)
          // erm...
          if (value) value = parseInt(value as unknown as string)
        } else if (info.includes(matchInfo[0])) {
          // get other info
          value = line.match(/\w+_\w+/i)
          if (value) value = value[0]
        }

        if (value) pokemon[name][matchInfo[0]] = value
      }
    })
    // console.log(pokemon.SPECIES_ARCHEOPS)
  }

  await fetchNames()
  await fetchStats()

  return pokemon
}
