# Rapport de vérification des imports SCSS dans les composants Svelte

## Problèmes détectés

### Composants sans fichier SCSS associé ou sans import `<style global lang="scss">`

#### base
- Columner.svelte : pas de fichier SCSS associé
- Column.svelte : pas de fichier SCSS associé
- DemoerCode.svelte : pas de fichier SCSS associé
- Demoer.svelte : pas de fichier SCSS associé
- DemoPage.svelte : pas de fichier SCSS associé
- DemoerComponent.svelte : pas de fichier SCSS associé
- Debug.svelte : pas de fichier SCSS associé

#### controls
- ButtonMenu.svelte : pas de fichier SCSS associé
- ButtonAction.svelte : pas de fichier SCSS associé

#### data
- DataListRow.svelte : pas de fichier SCSS associé
- DataListHead.svelte : pas de fichier SCSS associé
- DataListCell.svelte : pas de fichier SCSS associé
- DataList.preview.svelte : pas de fichier SCSS associé
- DataList.demo.svelte : pas de fichier SCSS associé

#### navigation
- Tabs.svelte : pas de fichier SCSS associé

#### ui
- ServiceBox.svelte : pas de fichier SCSS associé
- Preview.svelte : pas de fichier SCSS associé
- PanelSlide.svelte : pas de fichier SCSS associé
- PanelGrid.svelte : pas de fichier SCSS associé
- Paneler.svelte : pas de fichier SCSS associé
- MenuListTitle.svelte : pas de fichier SCSS associé
- MenuListItem.svelte : pas de fichier SCSS associé
- MenuList.svelte : pas de fichier SCSS associé
- MenuTitle.svelte : pas de fichier SCSS associé
- Marquee.svelte : pas de fichier SCSS associé
- Login.svelte : pas de fichier SCSS associé

#### Import SCSS non global
- Paper.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Icon.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Divider.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- ContentSwitcher.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Chipper.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Cartouche.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- BreadCrumb.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Box.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Badge.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Backdrop.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Avatar.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`
- Alert.svelte : utilise `<style lang="scss">` au lieu de `<style global lang="scss">`

---

*Ce rapport liste les composants à corriger pour respecter l'import SCSS global.*
