import React, { useEffect, useRef } from "react";
import {
  aggregationToggleOpaque as aggregationToggleOpaqueStyle,
  aggregationToggle as aggregationToggleStyle,
  contrast as contrastStyle,
  first as firstStyle,
  last as lastStyle,
  resultsTable as resultsTableStyle,
} from "./Styles.scss";
import { useLocation, useNavigate } from "@reach/router";

import AggregationIcon from "./AggregationIcon";
import Badge from "@mui/material/Badge";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Checkbox from "@mui/material/Checkbox";
import Citation from "./Citation";
import DownloadButton from "./DownloadButton";
import FiberManualRecordSharpIcon from "@mui/icons-material/FiberManualRecordSharp";
import FilterListIcon from "@mui/icons-material/FilterList";
import GetAppIcon from "@mui/icons-material/GetApp";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LinkButton from "./LinkButton";
import MuiTableCell from "@mui/material/TableCell";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ReportError from "./ReportError";
import ResultFilter from "./ResultFilter";
import ResultModalControl from "./ResultModalControl";
import SearchPagination from "./SearchPagination";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SettingsIcon from "@mui/icons-material/Settings";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "./Tooltip";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import classnames from "classnames";
import { compose } from "recompose";
import dispatchRecord from "../hocs/dispatchRecord";
import expandFieldList from "../functions/expandFieldList";
import { formatter } from "../functions/formatter";
import makeStyles from "@mui/styles/makeStyles";
import { mixColor } from "../functions/mixColor";
import qs from "../functions/qs";
import { styled } from "@mui/material/styles";
import withColors from "../hocs/withColors";
import withNames from "../hocs/withNames";
import withRanks from "../hocs/withRanks";
import withSearch from "../hocs/withSearch";
import withSearchDefaults from "../hocs/withSearchDefaults";
import withSiteName from "../hocs/withSiteName";
import withStyles from "@mui/styles/withStyles";
import withTaxonomy from "../hocs/withTaxonomy";
import withTypes from "../hocs/withTypes";

const borderColor = "#dddddd";
const darkColor = 44;
const lightColor = 22;

const StyledTableRow = withStyles((theme) => ({
  root: {
    width: "100%",
  },
}))(TableRow);

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#333",
    color: "#fff",
    top: 0,
    right: 0,
    borderRadius: "10px",
    border: "2px solid white",
    transform: "translate(98%, -50%)",
  },
}));

export const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "calc( 100% - 0.5em )",
    marginBottom: "1em",
    marginLeft: "0.5em",
    minWidth: "750px",
  },
  table: {
    maxWidth: "100%",
    minWidth: "750px",
  },
  ["PrivateSwitchBase-root-4"]: {
    padding: "3px",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: "1px",
    margin: -1,
    overflow: "hidden",
    padding: "0px",
    position: "absolute",
    top: 20,
    width: "1px",
  },
}));

const TableCell = styled(MuiTableCell)({
  padding: "1px 6px",
  lineHeight: "inherit",
});

const StickyCell = withStyles((theme) => ({
  root: {
    position: "sticky",
    left: 0,
    zIndex: 100,
  },
}))(TableCell);

const OddTableCell = withStyles((theme) => ({
  root: {
    textAlign: "center",
    backgroundColor: `#ffffff00`,
  },
}))(TableCell);

const EvenTableCell = withStyles((theme) => ({
  root: {
    backgroundColor: `${borderColor}33`,
  },
}))(OddTableCell);

const SpanTableCell = withStyles((theme) => ({
  root: {
    textAlign: "left",
  },
}))(EvenTableCell);

const StyledCheckbox = ({ color, fontSize = "small", ...props }) => {
  return (
    <Checkbox
      style={{
        padding: "1px",
        color: props.color,
      }}
      icon={<CheckBoxOutlineBlankIcon style={{ fontSize, fill: color }} />}
      checkedIcon={<CheckBoxIcon style={{ fontSize, fill: color }} />}
      {...props}
    />
  );
};

const StyledColbox = ({ color, ...props }) => {
  return (
    <Checkbox
      style={{
        padding: "1px",
        color,
      }}
      icon={<SettingsApplicationsIcon style={{ fontSize: "small" }} />}
      checkedIcon={<SettingsIcon style={{ fontSize: "small" }} />}
      {...props}
    />
  );
};

const StyledColSplit = ({ color, ...props }) => {
  return (
    <Checkbox
      style={{
        padding: "1px",
        color,
      }}
      icon={<ViewWeekOutlinedIcon style={{ fontSize: "small" }} />}
      checkedIcon={<ViewWeekIcon style={{ fontSize: "small" }} />}
      {...props}
    />
  );
};

const SortableCell = ({
  name,
  field = name,
  summary = "",
  description,
  status,
  colCount = 0,
  colSpan = 0,
  color,
  classes,
  searchIndex,
  CustomCell,
  borderBottom,
  statusColors = {},
  sortBy,
  sortOrder,
  sortDirection,
  handleTableSort = () => {},
  setAttributeSettings,
  showExcludeBoxes,
  excludeDirect,
  excludeAncestral,
  excludeDescendant,
  excludeMissing,
  handleToggleExclusion = () => {},
  handleToggleColSpan = () => {},
}) => {
  if (!CustomCell) {
    CustomCell = TableCell;
  }
  let css = aggregationToggleStyle;
  let prefix = name.replace(/:.+$/, "");
  if (
    excludeAncestral &&
    (excludeDirect.hasOwnProperty(prefix) ||
      excludeDescendant.hasOwnProperty(prefix) ||
      excludeAncestral.hasOwnProperty(prefix) ||
      excludeMissing.hasOwnProperty(prefix))
  ) {
    css = classnames(aggregationToggleStyle, aggregationToggleOpaqueStyle);
  }

  let title = handleTableSort ? `Sort by ${field}` : field;
  if (description) {
    title = (
      <div style={{ whiteSpace: "pre-line", maxWidth: "14em" }}>
        <div>{title}</div>
        <div
          style={{
            width: "100%",
            marginTop: "0.5em",
            borderTop: "solid white 1px",
          }}
        >
          {description}
        </div>
        {status && status != "stable" && (
          <div
            style={{
              width: "100%",
              marginTop: "0.5em",
              textAlign: "right",
            }}
          >
            status: {status}
          </div>
        )}
      </div>
    );
  }

  let SpanCell = colSpan > 0 ? SpanTableCell : CustomCell;

  let cellCss = "";
  if (colSpan > 0) {
    cellCss = classnames(firstStyle, lastStyle);
  }

  if (Array.isArray(summary)) {
    summary = summary[0];
  }

  let cellTitle =
    summary && summary.startsWith("metadata.")
      ? `${name}${summary.replace("metadata", "")}`
      : name;
  return (
    <SpanCell
      key={`${name}_${summary}`}
      colSpan={colSpan}
      className={cellCss}
      style={{
        whiteSpace: "normal",
        wordWrap: "break-word",
        maxWidth: "8rem",
        minWidth: "3rem",
        lineHeight: "1rem",
        verticalAlign: "bottom",
        borderBottom,
        backgroundColor: color,
      }}
      sortDirection={sortDirection}
    >
      <Tooltip key={field} title={title} arrow>
        {(handleTableSort && (
          <TableSortLabel
            active={sortBy === field}
            direction={sortOrder}
            onClick={() =>
              handleTableSort(
                sortDirection && sortOrder === "desc"
                  ? { sortBy: "none" }
                  : {
                      sortBy: field,
                      sortOrder:
                        sortDirection && sortOrder === "asc" ? "desc" : "asc",
                    },
              )
            }
          >
            {/* {name} */}
            {cellTitle.split("_").join(`_\u200b`).split(".").join(`.\u200b`)}
            {status && status != "stable" && <sup>{`\u2020`}</sup>}
            {sortBy === field ? (
              <span className={classes.visuallyHidden}>
                {sortOrder === "desc"
                  ? "sorted descending"
                  : "sorted ascending"}
              </span>
            ) : null}
          </TableSortLabel>
        )) || (
          <span>
            {name.split("_").join(`_\u200b`)}
            {status && status != "stable" && <sup>{`\u2020`}</sup>}
          </span>
        )}
      </Tooltip>
      <br />
      {(showExcludeBoxes && (
        <span className={css}>
          {showExcludeBoxes == "all" && (
            <Tooltip
              key={"direct"}
              title={"Toggle directly measured values"}
              arrow
            >
              <span>
                <StyledCheckbox
                  checked={!excludeDirect.hasOwnProperty(prefix)}
                  onChange={() =>
                    handleToggleExclusion({ toggleDirect: prefix })
                  }
                  color={statusColors.direct || "green"}
                  inputProps={{ "aria-label": "direct checkbox" }}
                />
              </span>
            </Tooltip>
          )}
          {showExcludeBoxes == "all" && (
            <Tooltip
              key={"descendant"}
              title={"Toggle values inferred from descendant taxa"}
              arrow
            >
              <span>
                <StyledCheckbox
                  checked={!excludeDescendant.hasOwnProperty(prefix)}
                  onChange={() =>
                    handleToggleExclusion({ toggleDescendant: prefix })
                  }
                  color={statusColors.descendant || "orange"}
                  inputProps={{ "aria-label": "descendant checkbox" }}
                />
              </span>
            </Tooltip>
          )}
          {showExcludeBoxes == "all" && (
            <Tooltip
              key={"ancestral"}
              title={"Toggle values inferred from ancestral taxa"}
              arrow
            >
              <span>
                <StyledCheckbox
                  checked={!excludeAncestral.hasOwnProperty(prefix)}
                  onChange={() =>
                    handleToggleExclusion({ toggleAncestral: prefix })
                  }
                  color={statusColors.ancestral || "red"}
                  inputProps={{ "aria-label": "ancestral checkbox" }}
                />
              </span>
            </Tooltip>
          )}
          <Tooltip key={"missing"} title={"Toggle missing values"} arrow>
            <span>
              <StyledCheckbox
                checked={!excludeMissing.hasOwnProperty(prefix)}
                onChange={() =>
                  handleToggleExclusion({ toggleMissing: prefix })
                }
                color={"black"}
                inputProps={{ "aria-label": "missing checkbox" }}
              />
            </span>
          </Tooltip>
          {(searchIndex == "taxon" || searchIndex == "assembly") && (
            <Tooltip key={"columns"} title={"Show/hide subset columns"} arrow>
              <span>
                <StyledColbox
                  // checked={!excludeAncestral.hasOwnProperty(prefix)}
                  // onChange={() =>
                  //   handleToggleExclusion({ toggleAncestral: prefix })
                  // }
                  onClick={() => {
                    setAttributeSettings({
                      attributeId: prefix,
                      adjustColumns: true,
                      currentRecordId: "none",
                      showAttribute: true,
                    });
                  }}
                  color={"black"}
                  inputProps={{ "aria-label": "show/hide columns" }}
                />
              </span>
            </Tooltip>
          )}
          {colCount > 0 && (
            <Tooltip key={"split"} title={"Toggle split column"} arrow>
              <span>
                <span>
                  <StyledColSplit
                    checked={colSpan > 0}
                    // onChange={() =>
                    //   handleToggleExclusion({ toggleAncestral: prefix })
                    // }
                    onClick={() => {
                      handleToggleColSpan(field, colSpan);
                    }}
                    color={"black"}
                    inputProps={{ "aria-label": "split/collapse column" }}
                  />
                </span>
              </span>
            </Tooltip>
          )}
        </span>
      )) || <span className={css}></span>}
    </SpanCell>
  );
};

const setCellClassName = (i, length, force) => {
  if (length == 1 && !force) {
    return "";
  }
  let css = i % 2 == 1 ? contrastStyle : "";
  if (i == 0) {
    css = classnames(css, firstStyle);
  }
  if (i == length - 1) {
    css = classnames(css, lastStyle);
  }
  return css;
};

export const setLinkIcons = ({
  type,
  key,
  result,
  record = { test: "test" },
}) => {
  if (!type.file_paths) {
    return [];
  }
  let parts = type.field.split(".");
  if (parts.length == 1) {
    if (type.file_paths[key]) {
      let { color } = type.file_paths[key];
      if (type.file_paths[key].all) {
        return [{ expand: `${type.field}.${key}.all`, color }];
      }
      return [{ expand: `${type.field}.${key}.run`, color }];
    }
    return [{ expand: false }];
  }
  if (parts.length != 3 || !type.file_paths[parts[1]]) {
    return [];
  }

  let run = parts[2];
  // let { color } = type.file_paths[parts[1]] || {};
  if (run == "run") {
    parts[2] = key;
    return [{ expand: parts.join("."), color: type.color }];
  }
  if (!type.file_paths[parts[1]][key]) {
    return [];
  }

  let { name, links } = type.file_paths[parts[1]][key];
  return links.map(({ icon, pattern, title }) => {
    let arr = pattern.split(/[\{\}]/);
    arr.forEach((item, i) => {
      if (i % 2 == 1) {
        if (item == "run") {
          arr[i] = run;
        } else if (item == "name") {
          arr[i] = name;
        } else if (result) {
          if (result.hasOwnProperty(item)) {
            arr[i] = result[item];
          } else if (result.result.hasOwnProperty(item)) {
            arr[i] = result.result[item];
          } else if (result.result.fields.hasOwnProperty(item)) {
            arr[i] = result.result.fields[item].value;
          } else {
            let bits = item.split(".");
            let field = bits.shift();
            if (result.result.fields.hasOwnProperty(field)) {
              arr[i] =
                result.result.fields[field][`metadata.${bits.join(".")}`];
            }
          }
        } else if (record) {
          if (record.hasOwnProperty(item)) {
            arr[i] = record[item];
          } else if (record.record.hasOwnProperty(item)) {
            arr[i] = record.record[item];
          } else if (record.record.attributes.hasOwnProperty(item)) {
            arr[i] = record.result.attributes[item].value;
          } else {
            let bits = item.split(".");
            let field = bits.shift();
            if (record.result?.attributes?.hasOwnProperty(field)) {
              arr[i] =
                record.result.attributes[field][`metadata.${bits.join(".")}`];
            }
          }
        }
      }
    });
    return {
      icon,
      color: type.color,
      url: arr.join(""),
      title,
    };
  });
};

const findLastIndex = ({ name, field, expandedTypes }) => {
  let index = expandedTypes.findIndex(({ name: n }) => n == name);
  let parts = field.split(".");
  for (let i = index + 1; i < expandedTypes.length; i++) {
    if (parts.length > 1 && parts[parts.length - 1] != "run") {
      if (expandedTypes[i].field.startsWith(`${parts[0]}.${parts[1]}`)) {
        index = i;
      }
    } else if (expandedTypes[i].field.startsWith(`${name}.`)) {
      index = i;
    } else {
      break;
    }
  }
  return index;
};

const formatCellValue = ({
  value,
  type,
  field,
  searchIndex,
  charLimit = 20,
}) => {
  let entries = [];
  if (Array.isArray(value)) {
    value = formatter(value, searchIndex, "array");
    let charLimit = 20;
    for (let v of value.values) {
      let entry = v[0];
      if (charLimit == 20 || charLimit - entry.length > 0) {
        entries.push(entry);
        charLimit -= entry.length;
      }
    }
    value = entries.join(", ");
    if (field.value.length > 1) {
      length = field.value.length;
    }
  } else {
    value = formatter(value, searchIndex);
  }
  if (
    type.summary == "value" &&
    Array.isArray(field.value) &&
    field.length > entries.length
  ) {
    let badgeContent = `+${field.length - entries.length}`;
    let badgeLength = (badgeContent.length + 1) * 8;
    value = (
      <div
        style={{ paddingRight: `${badgeLength}px`, display: "inline-block" }}
      >
        <StyledBadge badgeContent={badgeContent} max={100000}>
          <span style={{ display: "inline-block", position: "relative" }}>
            {value}
          </span>
        </StyledBadge>
      </div>
    );
  }
  return value;
};

const ResultTable = ({
  types,
  displayTypes,
  fetchSearchResults,
  saveSearchResults,
  searchResults,
  searchDefaults,
  setSearchDefaults,
  searchTerm,
  hideEmpty = true,
  setSearchTerm,
  activeNameClasses,
  activeRanks,
  searchIndex,
  setPreferSearchTerm,
  setAttributeSettings,
  statusColors,
  taxonomy,
  basename,
}) => {
  const rootRef = useRef(null);
  const expandColumns =
    searchDefaults.expandColumns ||
    (searchTerm.expand || "")
      .split(",")
      .reduce((a, b) => ({ ...a, [b]: true }), {});
  let expandedTypes = [];
  let emptyBuckets = new Set();
  let constraints = {};
  if (searchResults.aggs?.fields) {
    emptyBuckets = new Set(
      Object.entries(searchResults.aggs.fields.by_key.buckets)
        .filter(([_, obj]) => obj.doc_count == 0)
        .map(([key, obj]) => key),
    );
    for (let [key, value] of Object.entries(
      searchResults.aggs.fields.by_key.buckets,
    )) {
      let { buckets, sum_other_doc_count } = value.value_list;
      if (buckets.length >= 1) {
        constraints[key] = buckets.map(({ key }) => key);
      }
      if (sum_other_doc_count >= 1) {
        constraints[key].push("other");
      }
    }
    for (let [key, value] of Object.entries(searchResults.aggs.fields)) {
      if (key.endsWith("_metadata")) {
        for (let [path, obj] of Object.entries(value).filter(
          ([p]) => p != "doc_count",
        )) {
          constraints[path] = obj.buckets.map(({ key }) => key);
          if (obj.sum_other_doc_count >= 1) {
            constraints[path].push("other");
          }
        }
      }
    }
  }
  if (searchTerm) {
    if (searchTerm.fields) {
      let fieldList = expandFieldList({ fields: searchTerm.fields, types });
      expandedTypes = displayTypes
        .filter(({ name }) => !emptyBuckets.has(name) && name != "none")
        .map(({ name, ...rest }) => ({
          name,
          field: name,
          ...structuredClone({ rest }),
        }));
      for (let field of fieldList) {
        let name, summary;
        if (field.includes(":")) {
          [name, summary] = field.split(":");
        } else if (field.includes(".")) {
          [name, ...summary] = field.split(".");
          summary = `metadata.${summary.join(".")}`;
        } else {
          continue;
        }
        let index = findLastIndex({ name, field, expandedTypes });
        let defaultValue = (types[name] || { processed_simple: "value" })
          .processed_simple;
        expandedTypes.splice(index + 1, 0, {
          ...expandedTypes[index],
          name: field.includes(".") ? name : `${name}:${summary}`,
          summary: summary || defaultValue,
          field,
        });
      }
      for (let obj of expandedTypes) {
        let { name, field, summary, file_paths } = obj;
        if (name != field && file_paths) {
          let [_, key] = field.split(".");
          let { color } = file_paths[key] || {};
          obj.color = color;
        }
        name = name.replace(/:.+/, "");
        let defaultValue = (types[name] || { processed_simple: "value" })
          .processed_simple;
        if (["direct", "descendant", "ancestor"].includes(summary)) {
          summary = defaultValue;
        }
        obj.summary = summary || defaultValue;
      }
    } else {
      expandedTypes = displayTypes
        .filter(({ name }) => !emptyBuckets.has(name))
        .map((obj) => structuredClone(obj));
      for (let obj of expandedTypes) {
        obj.summary = "value";
        obj.field = obj.name;
      }
    }
  }

  if (searchResults && searchResults.status && searchResults.status.error) {
    return (
      <div
        style={{
          position: "relative",
          height: "15em",
        }}
      >
        <ReportError report={"search"} error={searchResults.status.error} />
      </div>
    );
  } else if (
    !searchResults.status ||
    !searchResults.status.hasOwnProperty("hits")
  ) {
    return null;
  }
  const location = useLocation();
  useEffect(() => {
    if (!location.search.match("report=")) {
      window.scrollTo(0, 0);
    }
  }, []);
  const navigate = useNavigate();
  const classes = useStyles();
  let sortBy = searchTerm.sortBy || "";
  let sortOrder = searchTerm.sortOrder || "asc";
  const handleRecordClick = (record) => {
    setPreferSearchTerm(false);
    let recordId, searchText;
    if (searchIndex == "assembly") {
      recordId = record.assembly_id;
      searchText = record.assembly_id;
    } else if (searchIndex == "sample") {
      recordId = record.sample_id;
      searchText = record.sample_id;
    } else if (searchIndex == "feature") {
      recordId = record.feature_id;
      searchText = record.feature_id;
    } else {
      recordId = record.taxon_id;
      searchText = record.scientific_name;
    }
    navigate(
      `${basename}/record?recordId=${recordId}&result=${searchIndex}&taxonomy=${taxonomy}#${encodeURIComponent(
        searchText,
      )}`,
    );
  };

  const handleToggleColSpan = (id, colSpan, linked) => {
    // currently unable to make this persist without a page reload
    if (linked) {
      let fields = searchTerm.fields
        ? searchTerm.fields.split(",")
        : displayTypes.map((d) => d.name);
      let expand = expandColumns;
      let newExpandColumns = { ...expandColumns };

      if (!fields.includes(id)) {
        let prefix = id.replace(/\.[^\.]+$/, "");
        fields = fields.filter(
          (f) =>
            !f.startsWith(prefix) ||
            f == `${prefix}.run` ||
            f == `${prefix}.all`,
        );

        newExpandColumns = Object.entries(expandColumns)
          .map(([k, v]) => {
            if (
              k.startsWith(prefix) &&
              k != `${prefix}.run` &&
              k != `${prefix}.all`
            ) {
              return [k, false];
            }
            return [k, v];
          })
          .reduce((a, [k, v]) => ({ ...a, [k]: v }), {});
        expand = Object.entries(newExpandColumns)
          .filter(([k, v]) => v)
          .map(([k]) => k);
        if (id == `${prefix}.all`) {
          fields.push(`${prefix}.run`);
          // expand.push(`${prefix}.run`);
          // newExpandColumns[`${prefix}.run`] = true;
        }
        fields.push(id);
        expand.push(id);
        fields = [...new Set(fields)];
        newExpandColumns[id] = true;
      } else if (colSpan > 0) {
        let prefix = id.replace(/\.run$/, "").replace(/\.all$/, "");
        fields = fields.filter((f) => !f.startsWith(prefix));
        newExpandColumns = Object.entries(expandColumns)
          .map(([k, v]) => {
            if (k.startsWith(prefix)) {
              return [k, false];
            }
            return [k, v];
          })
          .reduce((a, [k, v]) => ({ ...a, [k]: v }), {});
        expand = Object.entries(newExpandColumns)
          .filter(([k, v]) => v)
          .map(([k]) => k);
      }
      setSearchDefaults({ expandColumns: newExpandColumns });

      if (fields != searchTerm.fields) {
        navigate(
          `${basename}${location.pathname}?${qs.stringify({
            ...searchTerm,
            expand: expand.join(","),
            fields: fields.join(","),
          })}`,
        );
      }
    } else {
      let newExpandColumns = { ...expandColumns };
      if (colSpan > 0) {
        newExpandColumns[id] = false;
        setSearchDefaults({ expandColumns: newExpandColumns });
      } else {
        newExpandColumns[id] = true;
        setSearchDefaults({ expandColumns: newExpandColumns });
      }
      // let expand = Object.entries(newExpandColumns)
      //   .filter(([k, v]) => v)
      //   .map(([k]) => k);
      // navigate(
      //   `${basename}${location.pathname}?${qs.stringify({
      //     ...searchTerm,
      //     expand: expand.join(","),
      //   })}`
      // );
    }
  };

  const handleToggleExclusion = ({
    toggleAncestral,
    toggleDescendant,
    toggleDirect,
    toggleMissing,
  }) => {
    setPreferSearchTerm(false);
    let options = { ...searchTerm, offset: 0 };
    let ancestral = arrToObj(options.excludeAncestral);
    if (toggleAncestral) {
      ancestral[toggleAncestral] = !ancestral[toggleAncestral];
    }
    options.excludeAncestral = [];
    Object.keys(ancestral).forEach((key) => {
      if (ancestral[key]) {
        options.excludeAncestral.push(key);
      }
    });
    let descendant = arrToObj(options.excludeDescendant);
    if (toggleDescendant) {
      descendant[toggleDescendant] = !descendant[toggleDescendant];
    }
    options.excludeDescendant = [];
    Object.keys(descendant).forEach((key) => {
      if (descendant[key]) {
        options.excludeDescendant.push(key);
      }
    });
    let direct = arrToObj(options.excludeDirect);
    if (toggleDirect) {
      direct[toggleDirect] = !direct[toggleDirect];
    }
    options.excludeDirect = [];
    Object.keys(direct).forEach((key) => {
      if (direct[key]) {
        options.excludeDirect.push(key);
      }
    });
    let missing = arrToObj(options.excludeMissing);
    if (toggleMissing) {
      missing[toggleMissing] = !missing[toggleMissing];
    }
    options.excludeMissing = [];
    Object.keys(missing).forEach((key) => {
      if (missing[key]) {
        options.excludeMissing.push(key);
      }
    });
    navigate(
      `${basename}/search?${qs.stringify(options)}${location.hash || ""}`,
    );
  };
  const arrToObj = (arr) => {
    let obj = {};
    if (arr) {
      arr.forEach((key) => {
        obj[key] = true;
      });
    }
    return obj;
  };
  const handleTableSort = ({
    sortBy,
    sortOrder,
    toggleAncestral,
    toggleDescendant,
    toggleDirect,
    toggleMissing,
  }) => {
    let options = { ...searchTerm };
    if (sortBy && sortBy != "") {
      options.sortBy = sortBy;
      options.sortOrder = sortOrder;
    } else if (sortBy) {
      delete options.sortBy;
      delete options.sortOrder;
    }
    if (location.search.match(/tax_tree%28/)) {
      options.query = options.query.replace("tax_name", "tax_tree");
    }
    options.offset = 0;
    navigate(
      `${location.pathname}?${qs.stringify(options)}${location.hash || ""}`,
    );
  };

  const setColSpan = ({ type, maxColSpan = 0 }) => {
    let [name, summary] = type.name.split(":");
    let fullName = type.field.match(/\./) ? type.field : name;
    let fieldName = name;
    if (type.return_type) {
      if (!summary) {
        summary = type.return_type;
      } else {
        fieldName = `${name}:${summary}`;
      }
    }
    let colSpan = 0;
    let colCount = 0;
    if (!summary || summary == "value") {
      colCount = constraints[fullName]?.length || 0;
    }
    if (colCount > 0 && expandColumns[type.field]) {
      colSpan = colCount;
      maxColSpan = Math.max(colSpan, maxColSpan);
    }
    return { fieldName, summary, colCount, colSpan, maxColSpan };
  };

  let rows = searchResults.results.map((result) => {
    let name = result.result.scientific_name;
    let currentRecordId = result.result.taxon_id;
    if (
      result.result.taxon_rank == "species" ||
      result.result.taxon_rank == "subspecies"
    ) {
      name = <em>{name}</em>;
    }
    let cells = [
      <Tooltip title={"Click to view record"} arrow key={"name"}>
        <StickyCell
          style={{ cursor: "pointer" }}
          onClick={() => handleRecordClick(result.result)}
        >
          {name}
        </StickyCell>
      </Tooltip>,
      <Tooltip title={"Click to view record"} arrow key={"taxon_id"}>
        <TableCell
          style={{ cursor: "pointer" }}
          onClick={() => handleRecordClick(result.result)}
        >
          {result.result.taxon_id}
        </TableCell>
      </Tooltip>,
    ];
    Object.keys(activeNameClasses).forEach((nameClass) => {
      if (
        result.result.names &&
        result.result.names[nameClass] &&
        (result.result.names[nameClass].name ||
          result.result.names[nameClass].identifier)
      ) {
        let value =
          result.result.names[nameClass].name ||
          result.result.names[nameClass].identifier;
        value = formatCellValue({
          value,
          type: { summary: "value" },
          searchIndex,
          field: { value, length: value.length },
        });
        cells.push(
          <TableCell key={`name-${nameClass}`}>
            <span
              ref={rootRef}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setAttributeSettings({
                  currentRecordId,
                  attributeId: nameClass,
                  showAttribute: true,
                });
              }}
            >
              {value}
            </span>
          </TableCell>,
        );
      } else {
        cells.push(<TableCell key={nameClass}>-</TableCell>);
      }
    });

    Object.keys(activeRanks).forEach((rank) => {
      if (
        result.result.ranks &&
        result.result.ranks[rank] &&
        result.result.ranks[rank].scientific_name
      ) {
        cells.push(
          <TableCell key={`rank-${rank}`}>
            {result.result.ranks[rank].scientific_name}
          </TableCell>,
        );
      } else {
        cells.push(<TableCell key={rank}>-</TableCell>);
      }
    });
    if (searchIndex == "assembly") {
      currentRecordId = result.result.assembly_id;
      cells.push(
        <Tooltip title={"Click to view record"} arrow key={"assembly_id"}>
          <TableCell
            style={{ cursor: "pointer" }}
            onClick={() => handleRecordClick(result.result)}
          >
            {result.result.assembly_id}
          </TableCell>
        </Tooltip>,
      );
    }
    if (searchIndex == "sample") {
      currentRecordId = result.result.sample_id;
      cells.push(
        <Tooltip title={"Click to view record"} arrow key={"sample_id"}>
          <TableCell
            style={{ cursor: "pointer" }}
            onClick={() => handleRecordClick(result.result)}
          >
            {result.result.sample_id}
          </TableCell>
        </Tooltip>,
      );
    }
    if (searchIndex == "feature") {
      currentRecordId = result.result.feature_id;
      cells = [];
      cells.push(
        <Tooltip title={"Click to view assembly"} arrow key={"assembly_id"}>
          <TableCell
            style={{ cursor: "pointer" }}
            onClick={() => handleRecordClick(result.result)}
          >
            {result.result.assembly_id}
          </TableCell>
        </Tooltip>,
      );
      cells.push(
        <Tooltip title={"Click to view feature"} arrow key={"feature_id"}>
          <TableCell
            style={{ cursor: "pointer" }}
            onClick={() => handleRecordClick(result.result)}
          >
            {result.result.feature_id}
          </TableCell>
        </Tooltip>,
      );
    }

    expandedTypes.forEach((type) => {
      let { fieldName, summary, colCount, colSpan } = setColSpan({
        type,
      });
      if (
        result.result.fields &&
        result.result.fields.hasOwnProperty(fieldName)
      ) {
        let field = result.result.fields[fieldName];
        if (!summary) {
          summary = Array.isArray(type.summary)
            ? type.summary[0]
            : type.summary;
        }
        let value, binnable;
        if (type.processed_type == "date") {
          if (summary == "min") {
            summary = "from";
          }
          if (summary == "max") {
            summary = "to";
          }
        }
        if (summary && field[summary]) {
          value = field[summary];
          binnable = summary == "value";
        } else if (
          field.aggregation_source &&
          ["ancestor", "descendant", "direct", "estimate"].includes(summary)
        ) {
          if (
            field.aggregation_source.includes(summary) ||
            (summary == "estimate" &&
              ["ancestor", "descendant"].includes(field.aggregation_source[0]))
          ) {
            value = field.value;
            binnable = true;
          } else {
            value = undefined;
          }
        } else {
          value = field.value;
          binnable = true;
        }
        // uncomment to use binned value if available
        value =
          binnable && field.hasOwnProperty("binned") ? field.binned : value;
        if (colSpan == 0) {
          value = formatCellValue({
            value,
            type,
            searchIndex,
            field,
          });
          let color;
          if (type.name != type.field && type.file_paths) {
            let [_, key] = (type.field || type.name).split(".");
            ({ color } = type.file_paths[key] || {});
          }
          cells.push(
            <TableCell
              key={`${type.name}_${type.summary}`}
              style={{
                backgroundColor: `${type.color}${lightColor}`,
              }}
            >
              {typeof value != "undefined" && (
                <Grid
                  container
                  direction="row"
                  wrap="nowrap"
                  spacing={1}
                  alignItems={"center"}
                  ref={rootRef}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setAttributeSettings({
                      currentRecordId,
                      attributeId: type.name,
                      showAttribute: true,
                    });
                  }}
                >
                  {field.aggregation_source && (
                    <Grid>
                      <AggregationIcon
                        method={field.aggregation_source}
                        hasDescendants={field.has_descendants}
                      />
                    </Grid>
                  )}

                  <Grid
                    style={{ whiteSpace: "nowrap", ...(color && { color }) }}
                  >
                    {value}
                  </Grid>
                </Grid>
              )}
            </TableCell>,
          );
        } else {
          let values;
          try {
            values = (Array.isArray(value) ? value : [value]).map((v) =>
              v.toLowerCase(),
            );
          } catch {
            values = [];
          }
          let added = new Set();
          let fieldConstraints =
            constraints[type.field.replace(/:.+$/, "")] || [];
          fieldConstraints.forEach((key, i) => {
            let lcKey = key.toLowerCase();
            let css = setCellClassName(
              i,
              fieldConstraints.length,
              expandColumns[type.field],
            );
            let color = type.color || type.file_paths?.[lcKey]?.color;

            if (!values.includes(lcKey)) {
              if (lcKey == "other" && values.length > added.size) {
                let fill = statusColors[field.aggregation_source];

                cells.push(
                  <OddTableCell
                    key={`${type.field}-${lcKey}-${i}`}
                    className={css}
                  >
                    <RadioButtonCheckedOutlinedIcon
                      style={{ fill, fontSize: "1.25rem" }}
                    />
                  </OddTableCell>,
                );
              } else {
                cells.push(
                  <OddTableCell
                    key={`${type.field}-${lcKey}-${i}`}
                    className={css}
                    style={{
                      backgroundColor: `${color}${
                        i % 2 == 0 ? lightColor : darkColor
                      }`,
                    }}
                  >
                    {/* <CheckBoxOutlineBlankIcon style={{ opacity: 0.25 }} /> */}
                  </OddTableCell>,
                );
              }
            } else {
              let linkIcons = setLinkIcons({ type, key: key, result });
              added.add(lcKey);
              let list = type.value_metadata?.[lcKey]?.icons;
              let icons = [];
              let url = type.value_metadata?.default?.link;
              let RadioIcon = FiberManualRecordSharpIcon;
              let fill = statusColors[field.aggregation_source];
              // if (field.aggregation_source == "descendant") {
              //   RadioIcon = AdjustIcon;
              // } else if (field.aggregation_source == "ancestor") {
              //   RadioIcon = RadioButtonUncheckedIcon;
              // }
              for (let linkIcon of linkIcons) {
                let { title } = linkIcon;
                if (linkIcon.color) {
                  fill = linkIcon.color;
                }
                let onClick = () => {};
                if (linkIcon.icon) {
                  if (linkIcon.icon == "download") {
                    RadioIcon = GetAppIcon;
                  } else if (linkIcon.icon == "view") {
                    RadioIcon = VisibilityIcon;
                  }
                  onClick = (e) => {
                    e.stopPropagation();
                    window.open(linkIcon.url);
                  };
                } else if (linkIcon.expand) {
                  if (!expandColumns[linkIcon.expand]) {
                    RadioIcon = RadioButtonUncheckedIcon;
                    title = "Click to expand column";
                  } else {
                    RadioIcon = RadioButtonCheckedOutlinedIcon;
                    title = "Click to collapse column";
                  }
                  onClick = (e) => {
                    e.stopPropagation();
                    handleToggleColSpan(
                      linkIcon.expand,
                      expandColumns[linkIcon.expand] ? 1 : 0,
                      true,
                    );
                  };
                }
                let icon = (
                  <RadioIcon
                    style={{
                      fill,
                      cursor: "pointer",
                      fontSize: "1.25rem",
                    }}
                    key={`file-${linkIcon.icon || ""}-${i}`}
                    onClick={onClick}
                  />
                );
                if (title) {
                  icon = (
                    <Tooltip
                      title={title}
                      arrow
                      position="top"
                      key={`file-${linkIcon.icon || ""}-${i}`}
                    >
                      {icon}
                    </Tooltip>
                  );
                }
                icons.push(icon);
              }
              if (!linkIcons || linkIcons.length == 0) {
                icons.push(
                  <RadioIcon
                    style={{
                      fill,
                      cursor: "pointer",
                      fontSize: "1.25rem",
                    }}
                    key="check"
                  />,
                );
              }
              cells.push(
                <OddTableCell
                  key={`${type.field}-${lcKey}-${i}`}
                  style={{
                    whiteSpace: "nowrap",
                    backgroundColor: `${color}${
                      i % 2 == 0 ? lightColor : darkColor
                    }`,
                  }}
                  className={css}
                >
                  {icons}
                </OddTableCell>,
              );
            }
          });
        }
      } else {
        if (!colSpan) {
          colSpan = 0;
          colCount = 1;
        }
        for (let i = 0; i < colCount; i++) {
          let css = setCellClassName(i, colCount, expandColumns[type.field]);
          cells.push(
            <OddTableCell
              key={`${type.field || type.name}-${i}`}
              className={css}
            >
              {colSpan == 0 && "-"}
            </OddTableCell>,
          );
        }
      }
    });
    cells.push(
      <Tooltip title={"Click to view record"} arrow key={"go to record"}>
        <TableCell>
          <IconButton
            aria-label="go to record"
            size="small"
            onClick={() => handleRecordClick(result.result)}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </TableCell>
      </Tooltip>,
    );
    return <StyledTableRow key={result.id}>{cells}</StyledTableRow>;
  });
  let heads = [
    <SortableCell
      name={"scientific_name"}
      sortDirection={sortBy === "scientific_name" ? sortOrder : false}
      key={"scientific_name"}
      CustomCell={StickyCell}
      {...{ classes, handleTableSort, searchIndex, sortBy, sortOrder }}
    />,
    <SortableCell
      name={"taxon_id"}
      sortDirection={sortBy === "taxon_id" ? sortOrder : false}
      key={"taxon_id"}
      {...{ classes, handleTableSort, searchIndex, sortBy, sortOrder }}
    />,
  ];
  let filters = [
    <ResultFilter
      name={"scientific_name"}
      key={"scientific_name"}
      type="hidden"
      TableCell={StickyCell}
      value={""}
    />,
    <ResultFilter
      name={"taxon_id"}
      key={"taxon_id"}
      type="hidden"
      value={""}
    />,
  ];
  let expandedCols = [
    <StickyCell key={"scientific_name"} />,
    <TableCell key={"taxon_id"} />,
  ];
  let maxColSpan = 0;
  Object.keys(activeNameClasses).forEach((nameClass) => {
    heads.push(
      <SortableCell
        name={nameClass}
        key={`name-${nameClass}`}
        sortDirection={sortBy === nameClass ? sortOrder : false}
        {...{ classes, handleTableSort, searchIndex, sortBy, sortOrder }}
      />,
    );
    filters.push(
      <ResultFilter
        name={nameClass}
        key={`name-${nameClass}`}
        value={""}
        colSpan={1}
      />,
    );
    expandedCols.push(<TableCell key={nameClass} />);
  });
  Object.keys(activeRanks).forEach((rank) => {
    heads.push(
      <SortableCell
        name={rank}
        key={`rank-${rank}`}
        sortDirection={sortBy === rank ? sortOrder : false}
        {...{ classes, handleTableSort, searchIndex, sortBy, sortOrder }}
      />,
    );
    filters.push(<ResultFilter name={rank} key={`rank-${rank}`} value={""} />);
    expandedCols.push(<TableCell key={rank} />);
  });
  if (searchIndex == "assembly" || searchIndex == "feature") {
    heads.push(
      <SortableCell
        name={"assembly_id"}
        key={"assembly_id"}
        sortDirection={sortBy === "assembly_id" ? sortOrder : false}
        {...{ classes, handleTableSort, searchIndex, sortBy, sortOrder }}
      />,
    );
    filters.push(
      <ResultFilter name={"assembly_id"} key={"assembly_id"} value={""} />,
    );
    expandedCols.push(<TableCell key={"assembly_id"} />);
  }
  if (searchIndex == "sample") {
    heads.push(
      <SortableCell
        name={"sample_id"}
        key={"sample_id"}
        sortDirection={sortBy === "sample_id" ? sortOrder : false}
        {...{ classes, handleTableSort, searchIndex, sortBy, sortOrder }}
      />,
    );
    filters.push(
      <ResultFilter name={"sample_id"} key={"sample_id"} value={""} />,
    );
    expandedCols.push(<TableCell key={"sample_id"} />);
  }
  if (searchIndex == "feature") {
    heads = [heads.pop()];
    heads.push(
      <SortableCell
        name={"feature_id"}
        key={"feature_id"}
        sortDirection={sortBy === "feature_id" ? sortOrder : false}
        {...{ classes, handleTableSort, searchIndex, sortBy, sortOrder }}
      />,
    );
    filters.push(
      <ResultFilter name={"feature_id"} key={"feature_id"} value={""} />,
    );
    expandedCols.push(<TableCell key={"feature_id"} />);
  }
  for (let type of expandedTypes) {
    let sortDirection = sortBy === type.field ? sortOrder : false;
    if (type.processed_type == "geo_point") {
    } else {
    }
    let colCount, colSpan;
    ({ colCount, colSpan, maxColSpan } = setColSpan({
      type,
      maxColSpan,
    }));
    heads.push(
      <SortableCell
        key={`${type.name}_${type.summary}`}
        name={type.name}
        field={type.field}
        summary={type.summary}
        description={type.description}
        color={`${type.color}${darkColor}`}
        status={type.status}
        handleTableSort={type.processed_type != "geo_point" && handleTableSort}
        setAttributeSettings={setAttributeSettings}
        showExcludeBoxes={searchIndex == "taxon" ? "all" : "missing"}
        excludeAncestral={arrToObj(searchTerm.excludeAncestral)}
        excludeDescendant={arrToObj(searchTerm.excludeDescendant)}
        excludeDirect={arrToObj(searchTerm.excludeDirect)}
        excludeMissing={arrToObj(searchTerm.excludeMissing)}
        {...{
          classes,
          colCount,
          colSpan,
          handleToggleColSpan,
          handleToggleExclusion,
          searchIndex,
          setAttributeSettings,
          sortBy,
          sortDirection,
          sortOrder,
          statusColors,
        }}
      />,
    );

    let fieldConstraints = constraints[type.field.replace(/:.+$/, "")] || [];
    filters.push(
      <ResultFilter
        key={`${type.name}_${type.summary}`}
        name={type.name}
        field={type.field}
        colSpan={colSpan}
        color={`${type.color}${darkColor}`}
        TableCell={colSpan > 0 ? SpanTableCell : TableCell}
        value={""}
        fieldMeta={types[type.name]}
        constraints={fieldConstraints}
      />,
    );
    if (colSpan > 0) {
      fieldConstraints.forEach((v, i) => {
        let css = setCellClassName(
          i,
          fieldConstraints.length,
          expandColumns[type.field],
        );
        let color = type.color || type.file_paths?.[v]?.color;
        expandedCols.push(
          <OddTableCell
            key={`${type.name}_${type.summary}-${v}`}
            className={css}
            style={{
              backgroundColor: `${color}${i % 2 == 0 ? lightColor : darkColor}`,
            }}
          >
            {v.split("_").join(`_\u200b`).split(".").join(`.\u200b`)}
          </OddTableCell>,
        );
      });
    } else {
      expandedCols.push(
        <TableCell
          key={`${type.name}_${type.summary}`}
          colSpan={colSpan + 1}
          style={{
            backgroundColor: `${type.color}${lightColor}`,
          }}
        />,
      );
    }
  }
  heads.push(
    <Tooltip title={"Click to toggle filter options"} arrow key={"filter"}>
      <TableCell>
        <IconButton
          aria-label="toggle filter"
          size="small"
          onClick={() =>
            setSearchDefaults({ showFilter: !searchDefaults.showFilter })
          }
        >
          <FilterListIcon />
        </IconButton>
      </TableCell>
    </Tooltip>,
  );
  filters.push(<TableCell key={"filter"} />);
  expandedCols.push(<TableCell key={"filter"} />);

  let citationMessage;
  if (rows.length > 0) {
    citationMessage = (
      <Citation resultCount={rows.length} searchTerm={searchTerm} />
    );
  }
  return (
    <Grid
      container
      alignItems="center"
      direction="column"
      spacing={1}
      className={classes.root}
    >
      <Grid className={classes.table}>
        {/* {searchResults.isFetching ? (
          <Skeleton variant="rect" width={800} height={200} />
        ) : ( */}
        <TableContainer className={resultsTableStyle}>
          <Table size="small" aria-label="search results">
            <TableHead>
              <TableRow>{heads}</TableRow>
              {searchDefaults.showFilter && <TableRow>{filters}</TableRow>}
              {maxColSpan > 0 && <TableRow>{expandedCols}</TableRow>}
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>

        {/* )} */}
      </Grid>

      {/* <Grid
        // style={{
        //   display: "flex",
        //   justifyContent: "flex-start",
        //   position: "relative",
        //   overflow: "visible",
        // }}
      > */}
      {rows.length > 0 && (
        <>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing={1}
            size={10}
            className={classes.root}
          >
            <Grid>
              <LinkButton options={["search", "searchurl"]} />
            </Grid>
            <Grid>
              <SearchPagination />
            </Grid>
            <Grid style={{ marginLeft: "auto" }}>
              <DownloadButton
                onButtonClick={saveSearchResults}
                searchTerm={searchTerm}
              />
            </Grid>
            <ResultModalControl
              // currentRecordId={recordId}
              // attributeId={attribute}
              // showAttribute={showAttribute}
              // setShowAttribute={setShowAttribute}
              rootRef={rootRef}
            />
          </Grid>
          {citationMessage}
        </>
      )}
      {/* </Grid> */}
    </Grid>
  );
};

export default compose(
  dispatchRecord,
  withSiteName,
  withTypes,
  withTaxonomy,
  withColors,
  withSearch,
  withSearchDefaults,
  withRanks,
  withNames,
)(ResultTable);
