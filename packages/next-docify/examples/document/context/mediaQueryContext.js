import React from 'react';

let list = [];

if (process.browser) {
  list = [
    { name: 'widescreen', query: window.matchMedia('(min-width: 1200px)') },
    { name: 'desktop', query: window.matchMedia('(min-width: 961px)') },
    { name: 'tablet', query: window.matchMedia('(max-width: 960px)') },
    { name: 'mobile', query: window.matchMedia('(max-width: 640px)') },
  ];
}

export const resolveMatches = () => {
  return mediaQueryList.reduce((merged, cur) => {
    const { name, query } = cur;
    merged[name] = query.matches;
    return merged;
  }, {});
};

export const mediaQueryList = list;
export const defaultMatches = {
  mobile: true,
  tablet: true,
};

export const mediaQueryContext = React.createContext({
  mediaQueryList,
  queryMatches: {},
  resolveMatches,
});
