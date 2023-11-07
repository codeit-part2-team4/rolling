import logoIcon from "assets/images/icons/logoIcon.png";
import NavWhiteButton from "components/StyledButtons/NavWhiteButton";
import * as S from "./NavBar.style";

function NavBar() {
  return (
    <S.Wrapper>
      <S.Container>
        <S.LogoImage img src={logoIcon} alt="logo" />
        <NavWhiteButton>롤링 페이퍼 만들기</NavWhiteButton>
      </S.Container>
      <S.BottomLine />
    </S.Wrapper>
  );
}

export default NavBar;