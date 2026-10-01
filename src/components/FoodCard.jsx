export default function FoodCard({
  food,
  rank,
  onRemove,
  canRemove = true,
  isRemoving = false,
  disabledReason = '',
}) {
  return (
    <div
      className={`food-candidate-card ${isRemoving ? 'is-removing' : ''}`}
      style={{ '--food-theme': food.color }}
    >
      <div className="food-card-top">
        <div className="food-category-pill">
          {rank && <span className="food-rank">#{rank}</span>}
          <span className="food-category-text">{food.categoryName}</span>
        </div>
        {onRemove && (
          <button
            type="button"
            className={`food-remove-btn ${canRemove ? '' : 'is-locked'}`}
            onClick={() => onRemove(food.id)}
            aria-disabled={!canRemove}
            title={canRemove ? '이 메뉴 제외하기' : disabledReason || '최소 2개는 남아야 해요'}
            aria-label={`${food.name} 후보에서 제외`}
          >
            <span className="remove-icon" aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      <div className="food-card-body">
        <div className="food-emoji-circle">
          <span className="food-emoji" role="img" aria-label={food.name}>
            {food.emoji}
          </span>
        </div>
        <div className="food-card-text">
          <h3 className="food-name">{food.name}</h3>
          <p className="food-tagline">{food.tagline}</p>
        </div>
      </div>

      <div className="food-card-footer">
        <div className="food-spec-item">
          <span className="spec-label">예상 예산</span>
          <span className="spec-value">~{food.budget.toLocaleString()}원</span>
        </div>
        <div className="food-spec-item">
          <span className="spec-label">특징</span>
          <span className="spec-value">
            {food.soup ? '국물 있음' : '국물 없음'} ·{' '}
            {food.spicy === 0 ? '순한맛' : food.spicy === 1 ? '보통맛' : '매콤'}
          </span>
        </div>
      </div>
    </div>
  )
}
