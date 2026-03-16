export const THEME = {
  primary: '#165DFF',
  danger: '#E63946',
  textTitle: '#333333',
  textBody: '#666666',
  textHint: '#999999',
  bgLight: '#F8F9FA',
  white: '#FFFFFF',
  borderRadius: '4px',
  cardBorderRadius: '8px',
};

export const COMMON_STYLES = {
  pageContainer: {
    padding: '20px',
    background: '#fff',
    minHeight: '100%',
  },
  card: {
    background: THEME.bgLight,
    borderRadius: THEME.cardBorderRadius,
    padding: '15px',
    marginBottom: '15px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: THEME.textTitle,
  },
  body: {
    fontSize: '14px',
    color: THEME.textBody,
  },
  hint: {
    fontSize: '12px',
    color: THEME.textHint,
  },
  primaryBtn: {
    background: THEME.primary,
    borderColor: THEME.primary,
    borderRadius: THEME.borderRadius,
    height: '60px',
    fontSize: '16px',
    fontWeight: 500,
  },
  advantageTag: {
    color: '#fff',
    backgroundColor: THEME.danger,
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    marginRight: '8px',
    border: 'none',
  }
};
