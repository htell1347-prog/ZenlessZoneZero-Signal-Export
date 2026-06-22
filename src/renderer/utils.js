import * as IconComponents from "@element-plus/icons-vue";
const weaponTypeNames = new Set([
  '武器', 'Weapon', '무기', 'Arma', 'Arme', 'Оружие', 'อาวุธ', 'Vũ Khí', 'Waffe', 'Senjata',
  '音擎', 'W-Engine', 'W엔진', '音動機', 'Амплификатор', 'Verstärker', 'Moteur ampli'
])

const characterTypeNames = new Set([
  '角色', 'Character', '캐릭터', 'キャラクター', 'Personaje', 'Personnage', 'Персонажи', 'ตัวละคร', 'Nhân Vật', 'Figur', 'Karakter', 'Personagem',
  '代理人', 'Agent', '에이전트', 'エージェント', 'Агент', 'Agente', 'Agentin'
])

const bangbooTypeNames = new Set([
  '邦布', 'Bangboo', 'バンブー', '뱅부', 'Банбу'
])

const isCharacter = (name) => characterTypeNames.has(name)
const isWeapon = (name) => weaponTypeNames.has(name)
const isBangboo = (name) => bangbooTypeNames.has(name)

const IconInstaller = (app) => {
  Object.values(IconComponents).forEach(component => {
    app.component(component.name, component)
  })
}

export {
  isWeapon, isCharacter, isBangboo, IconInstaller
}
