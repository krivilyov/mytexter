import Input from "../input";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { TopicsData, LevelsData } from "../../interfaces/interfaces";

import styles from "../../styles/cabinet/FilterBuilder.module.scss";
import { useState, useRef, useEffect } from "react";

interface FilterValuesProps {
  quantity: string;
  phrase: string;
  level_id: string;
  topic_id: number;
  save: string;
}

interface FilterBuilderProps {
  topics: TopicsData[];
  levels: LevelsData[];
  btnSubmitFormClick: (type: FilterValuesProps) => void;
}

export default function FilterBuilder(props: FilterBuilderProps) {
  const { topics, levels, btnSubmitFormClick } = props;
  const refTopicMenu = useRef<HTMLDivElement>(null);

  const [selectTopic, setSelectTopic] = useState(topics[0]);
  const [selectOpen, setSelectOpen] = useState(false);

  const [values, setValues] = useState({
    quantity: "6",
    phrase: "0",
    level_id: `${levels[0] ? levels[0].id : 0}`,
    topic_id: topics[0] ? topics[0].id : 0,
    save: "0",
  });

  const handleClick = (e: CustomEvent) => {
    if (
      refTopicMenu.current &&
      !refTopicMenu.current.contains(e.target as Node)
    ) {
      setSelectOpen(false);
    }
  };

  useEffect(() => {
    if (selectOpen) {
      document.addEventListener("click", handleClick as EventListener, true);
      return () => {
        document.removeEventListener(
          "click",
          handleClick as EventListener,
          true
        );
      };
    }
  }, [selectOpen]);

  useEffect(() => {
    setValues({ ...values, topic_id: selectTopic.id });
  }, [selectTopic]);

  const onChangeFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.filterContainer}>
      <form>
        <div className={styles.filterGroupItems}>
          <div className={styles.filterGroupTitle}>Number of tests</div>
          <div className={styles.filterGroupItemsContainer}>
            <div className={styles.filterItem}>
              <Input
                id="quantity_6"
                name="quantity"
                type="radio"
                value="6"
                checked={true}
                onChange={onChangeFilterHandler}
              />
              <label className={styles.filterLabel} htmlFor="quantity_6">
                6
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="quantity_8"
                name="quantity"
                type="radio"
                value="8"
                onChange={onChangeFilterHandler}
              />
              <label className={styles.filterLabel} htmlFor="quantity_8">
                8
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="quantity_10"
                name="quantity"
                type="radio"
                value="10"
                onChange={onChangeFilterHandler}
              />
              <label className={styles.filterLabel} htmlFor="quantity_10">
                10
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="quantity_12"
                name="quantity"
                type="radio"
                value="12"
                onChange={onChangeFilterHandler}
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
                name="phrase"
                type="radio"
                value="1"
                onChange={onChangeFilterHandler}
              />
              <label className={styles.filterBoolLabel} htmlFor="phrase_yes">
                Yes
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="phrase_no"
                name="phrase"
                type="radio"
                value="0"
                checked={true}
                onChange={onChangeFilterHandler}
              />
              <label className={styles.filterBoolLabel} htmlFor="phrase_no">
                No
              </label>
            </div>
          </div>
        </div>
        {levels.length && (
          <div className={styles.filterGroupItems}>
            <div className={styles.filterGroupTitle}>Level of difficulty</div>
            <div className={styles.filterGroupItemsContainer}>
              {levels.map((level, index) => (
                <div className={styles.filterItem} key={level.id}>
                  <Input
                    id={`level_${level.id}`}
                    name="level_id"
                    type="radio"
                    value={`${level.id}`}
                    checked={index === 0 ? true : false}
                    onChange={onChangeFilterHandler}
                  />
                  <label
                    className={styles.filterLabel}
                    htmlFor={`level_${level.id}`}
                  >
                    {level.title}
                  </label>
                </div>
              ))}
              <div className={styles.filterItem}>
                <Input
                  id="level_rand"
                  name="level_id"
                  type="radio"
                  value="-1"
                  onChange={onChangeFilterHandler}
                />
                <label className={styles.filterLabel} htmlFor="level_rand">
                  <ShuffleIcon />
                </label>
              </div>
            </div>
          </div>
        )}

        {topics.length && (
          <div className={styles.filterGroupItems}>
            <div className={styles.filterGroupTitle}>Chose a topic</div>
            <div
              className={`${styles.selectContainer} ${
                selectOpen ? styles.selectContainerOpen : ""
              }`}
              ref={refTopicMenu}
            >
              <div
                className={styles.selectValue}
                onClick={() => {
                  setSelectOpen(!selectOpen);
                }}
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
                  <li
                    key={topic.id}
                    onClick={() => {
                      setSelectTopic(topic);
                      setSelectOpen(false);
                    }}
                  >
                    {topic.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className={styles.filterGroupItems}>
          <div className={styles.filterGroupTitle}>Save lesson?</div>
          <div className={styles.filterGroupItemsContainer}>
            <div className={styles.filterItem}>
              <Input
                id="save_yes"
                name="save"
                type="radio"
                value="1"
                onChange={onChangeFilterHandler}
              />
              <label className={styles.filterBoolLabel} htmlFor="save_yes">
                Yes
              </label>
            </div>
            <div className={styles.filterItem}>
              <Input
                id="save_no"
                name="save"
                type="radio"
                value="0"
                checked={true}
                onChange={onChangeFilterHandler}
              />
              <label className={styles.filterBoolLabel} htmlFor="save_no">
                No
              </label>
            </div>
          </div>
        </div>
      </form>
      <div className={styles.filterBtnCreateContainer}>
        <div
          className={styles.filterBtnCreate}
          onClick={() => {
            btnSubmitFormClick(values);
          }}
        >
          Create
        </div>
      </div>
    </div>
  );
}
