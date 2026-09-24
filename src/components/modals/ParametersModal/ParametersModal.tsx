import React from 'react';
import { useRoutesChat } from '../../../store/RoutesChatContext';
import { Modal } from '../../common/Modal/Modal';
import styles from './ParametersModal.module.css';

export const ParametersModal: React.FC = () => {
  const {
    parametersModalOpen,
    setParametersModalOpen,
    activeSession,
    temperature,
    setTemperature,
    updateSessionSystemPrompt
  } = useRoutesChat();

  if (!activeSession) return null;

  return (
    <Modal
      isOpen={parametersModalOpen}
      onClose={() => setParametersModalOpen(false)}
      title="Параметры сессии и шлюза Routes"
    >
      <div className={styles.form}>
        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <span>Температура креативности (v0Temperature)</span>
            <span className={styles.tempValue}>{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.labelRow}>
            <span>Системная инструкция (System Prompt)</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Инструкция для нейросети (роль, формат ответов, ограничения)..."
            value={activeSession.systemPrompt || ''}
            onChange={(e) => updateSessionSystemPrompt(e.target.value)}
          />
        </div>

        <div className={styles.infoBox}>
          Шлюз <strong>Routes</strong> автоматически обрабатывает сбои провайдеров и при возникновении ошибок или исчерпании лимитов (429) производит прозрачный failover между моделями из списка V0Models.json.
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setParametersModalOpen(false)}
          >
            Готово
          </button>
        </div>
      </div>
    </Modal>
  );
};
