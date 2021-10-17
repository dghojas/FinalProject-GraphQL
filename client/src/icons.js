// without webpack
import Logo from "./assets/img/logo.svg";

function getIcon(id) {
  let icons = {
    Logo: Logo
  };
  return icons[id];
}

export default getIcon;
