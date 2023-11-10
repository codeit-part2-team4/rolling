import RoundAddButton from "components/StyledButtons/RoundAddButton";
import * as S from "./CardList.style";
import Card from "components/CardList/Card";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import fetch from "apis/utils/fetch";

const LIMIT = 3;
let offset = 0;

function CardList({ isEditMode, id }) {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const target = useRef(null);

  const loadData = async (offset) => {
    try {
      if (!hasNext) return;
      setIsLoading(true);
      const { data: cards, status } = await fetch({
        url: `/recipients/${id}/messages/`,
        params: {
          limit: LIMIT,
          offset: offset,
        },
      });
      if (status !== 200) {
        throw new Error("메시지 카드 불러오기 실패");
      }
      const currentCards = cards?.results;
      setCards((prevCards) => [...prevCards, ...currentCards]);
      if (!cards?.next) setHasNext(false);
    } catch (error) {
      setError(error);
      setHasNext(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting && !isLoading) {
      observer.unobserve(entry.target);
      await loadData(offset);
      offset += LIMIT;
      observer.observe(entry.target);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    observer.observe(target.current);
    return () => observer.disconnect();
  }, [target]);

  const getDeleteCardId = (e) => {
    e.stopPropagation();
    setDeleteId(e.currentTarget.id);
  };

  const deleteCard = async () => {
    try {
      if (!deleteId) return;
      setIsLoading(true);
      const response = await fetch({
        url: `/messages/${deleteId}/`,
        method: "DELETE",
      });
      if (response.status !== 204) {
        throw new Error("메시지 카드 삭제 실패");
      }
      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== +deleteId)
      );
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    deleteCard();
  }, [deleteId]);

  return (
    <>
      <S.ListContainer>
        {!isEditMode && (
          <S.ButtonContainer>
            <Link to={`/post/${id}/message`}>
              <RoundAddButton />
            </Link>
          </S.ButtonContainer>
        )}
        {cards &&
          cards.map((card) => {
            return (
              <S.CardContainer key={card?.id}>
                <Card
                  item={card}
                  isEditMode={isEditMode}
                  getDeleteCardId={getDeleteCardId}
                />
              </S.CardContainer>
            );
          })}
      </S.ListContainer>
      {hasNext && <S.ScrollTarget ref={target}></S.ScrollTarget>}
    </>
  );
}

export default CardList;
