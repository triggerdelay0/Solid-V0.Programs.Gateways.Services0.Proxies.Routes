import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRoutesChat } from '../../../store/RoutesChatContext';
import { ModelOption } from '../../../types';
import { SearchIcon, ChevronDownIcon, CheckIcon, CloseIcon } from '../../../assets/icons/Icons';
import styles from './ModelSelector.module.css';

export const ModelSelector: React.FC = () => {
  const { models, selectedModel, setSelectedModel, isModelsLoading } = useRoutesChat();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Фильтрация моделей по введенной поисковой строке
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return models;
    const query = searchQuery.toLowerCase().trim();
    return models.filter(
      (m) =>
        m.id.toLowerCase().includes(query) ||
        m.name.toLowerCase().includes(query) ||
        m.provider.toLowerCase().includes(query)
    );
  }, [models, searchQuery]);

  // Группировка отфильтрованных моделей по провайдерам
  const groupedModels = useMemo(() => {
    const groups: Record<string, ModelOption[]> = {};
    for (const model of filteredModels) {
      const p = model.provider.toUpperCase();
      if (!groups[p]) groups[p] = [];
      groups[p].push(model);
    }
    return groups;
  }, [filteredModels]);

  const activeModelObj = models.find((m) => m.id === selectedModel);

  const handleSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        type="button"
        className={styles.selectorButton}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Выбор активной нейросети"
      >
        <div className={styles.selectedInfo}>
          <span className={styles.providerLabel}>
            {activeModelObj ? activeModelObj.provider.toUpperCase() : 'ROUTER'}
          </span>
          <span className={styles.modelName}>
            {isModelsLoading ? 'Загрузка моделей...' : activeModelObj?.name || selectedModel}
          </span>
        </div>
        <ChevronDownIcon size={16} className={`${styles.dropdownIcon} ${isOpen ? styles.openIcon : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Поле живого поиска моделей */}
          <div className={styles.searchBox}>
            <SearchIcon size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск по названию или провайдеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                <CloseIcon size={12} />
              </button>
            )}
          </div>

          <div className={styles.modelsList}>
            {Object.keys(groupedModels).length === 0 ? (
              <div className={styles.emptyResults}>Модели не найдены</div>
            ) : (
              Object.entries(groupedModels).map(([provider, providerModels]) => (
                <div key={provider}>
                  <div className={styles.groupHeader}>{provider}</div>
                  {providerModels.map((m) => {
                    const isSelected = m.id === selectedModel;
                    return (
                      <div
                        key={m.id}
                        className={`${styles.modelItem} ${isSelected ? styles.activeItem : ''}`}
                        onClick={() => handleSelect(m.id)}
                      >
                        <div className={styles.itemLeft}>
                          <div className={styles.itemTitle}>
                            {m.name}
                            {m.isFree && <span className={styles.freeTag}>FREE</span>}
                          </div>
                          <span className={styles.itemSub}>{m.id}</span>
                        </div>
                        {isSelected && <CheckIcon size={14} color="var(--text-accent)" />}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
