import Input from "../input";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { TopicsData } from "../../interfaces/interfaces";

import styles from "../../styles/cabinet/FilterBuilder.module.scss";
import { useState } from "react";

interface FilterBuilderProps {
  topics: TopicsData[];
}

export default function FilterBuilder(props: FilterBuilderProps) {
  const { topics } = props;

  const [selectTopic, setSelectTopic] = useState(topics[0]);
  const [selectOpen, setSelectOpen] = useState(false);

  return (
    <div className={styles.filterContainer}>
      <form>
        <div className={styles.filterGroupItems}>
          <div className={styles.filterGroupTitle}>Number of tests</div>
          <div className={styles.filterGroupItemsContainer}>
            <div className={styles.filterItem}>
              <Input
                id="quantity_6"
                name="quantity-radio-group"
                type="radio"
                value="6"
                checked={true}
              />
              <label className={styles.filterLabel} htmlFor="quantity_6">
                6
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="quantity_8"
                name="quantity-radio-group"
                type="radio"
                value="8"
              />
              <label className={styles.filterLabel} htmlFor="quantity_8">
                8
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="quantity_10"
                name="quantity-radio-group"
                type="radio"
                value="10"
              />
              <label className={styles.filterLabel} htmlFor="quantity_10">
                10
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="quantity_12"
                name="quantity-radio-group"
                type="radio"
                value="12"
              />
              <label className={styles.filterLabel} htmlFor="quantity_12">
                12
              </label>
            </div>
          </div>
        </div>
        <div className={styles.filterGroupItems}>
          <div className={styles.filterGroupTitle}>Including phrases?</div>
          <div className={styles.filterGroupItemsContainer}>
            <div className={styles.filterItem}>
              <Input
                id="phrase_yes"
                name="phrase-radio-group"
                type="radio"
                value="1"
              />
              <label className={styles.filterBoolLabel} htmlFor="phrase_yes">
                Yes
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="phrase_no"
                name="phrase-radio-group"
                type="radio"
                value="0"
                checked={true}
              />
              <label className={styles.filterBoolLabel} htmlFor="phrase_no">
                No
              </label>
            </div>
          </div>
        </div>
        <div className={styles.filterGroupItems}>
          <div className={styles.filterGroupTitle}>Level of difficulty</div>
          <div className={styles.filterGroupItemsContainer}>
            <div className={styles.filterItem}>
              <Input
                id="level_a1"
                name="level-radio-group"
                type="radio"
                value="A1"
                checked={true}
              />
              <label className={styles.filterLabel} htmlFor="level_a1">
                a1
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="level_a2"
                name="level-radio-group"
                type="radio"
                value="A2"
              />
              <label className={styles.filterLabel} htmlFor="level_a2">
                a2
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="level_b1"
                name="level-radio-group"
                type="radio"
                value="B1"
              />
              <label className={styles.filterLabel} htmlFor="level_b1">
                b1
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="level_rand"
                name="level-radio-group"
                type="radio"
                value="rand"
              />
              <label className={styles.filterLabel} htmlFor="level_rand">
                <ShuffleIcon />
              </label>
            </div>
          </div>
        </div>
        <div className={styles.filterGroupItems}>
          <div className={styles.filterGroupTitle}>Save lesson?</div>
          <div className={styles.filterGroupItemsContainer}>
            <div className={styles.filterItem}>
              <Input
                id="save_yes"
                name="save-radio-group"
                type="radio"
                value="1"
              />
              <label className={styles.filterBoolLabel} htmlFor="save_yes">
                Yes
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="save_no"
                name="save-radio-group"
                type="radio"
                value="0"
                checked={true}
              />
              <label className={styles.filterBoolLabel} htmlFor="save_no">
                No
              </label>
            </div>
          </div>
        </div>
        {topics.length && (
          <div className={styles.filterGroupItems}>
            <div className={styles.filterGroupTitle}>Chose a topic</div>
            <div
              className={`${styles.selectContainer} ${
                selectOpen ? styles.selectContainerOpen : ""
              }`}
            >
              <div
                className={styles.selectValue}
                onClick={() => setSelectOpen(!selectOpen)}
              >
                {selectTopic.title}
                <svg
                  viewBox="0 0 8 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.81502 0.744141L3.99414 3.56502L1.17326 0.744141L0.244141 1.67326L3.99414 5.42326L7.74414 1.67326L6.81502 0.744141Z"
                    fill="#F98600"
                  />
                </svg>
              </div>
              <ul className={styles.selectDropdown}>
                {topics.map((topic) => (
                  <li key={topic.id}>{topic.title}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
