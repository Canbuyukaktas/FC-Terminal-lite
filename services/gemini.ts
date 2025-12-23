import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";

/**
 * Helper to initialize the GenAI client with current API key // (c)fcalgobot.com
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * NEW: Performs deep strategic analysis of sector rotation based on RRG data.
 */
export const getDeepRRGAnalysis = async (rrgData: any) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following Sector Rotation (RRG) data and provide a professional portfolio allocation strategy.
      
      RRG Data: ${JSON.stringify(rrgData)}
      
      Based on the quadrants (Leading, Weakening, Lagging, Improving) and the market regime:
      1. Identify the 'Alpha' sectors to overweight.
      2. Identify 'Risk' sectors to lighten or hedge.
      3. Explain the implications of the current 'Tail' velocity.
      4. Provide a 3-step action plan for an institutional portfolio.
      
      Return as markdown with clear sections.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text;
  } catch (error) {
    console.error("getDeepRRGAnalysis error:", error);
    return null;
  }
};

/**
 * NEW: Audits high-profile portfolios (Hedge Funds, Politicians, Whale Investors)
 */
export const getHighProfilePortfolio = async (entity: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Conduct an institutional-grade audit of the latest known investment portfolio for: ${entity}. 
      Use search grounding to find the most recent 13F filings, Congressional disclosures (PTRs), or public fund reports.
      
      Identify:
      1. Core identity/strategy of the entity.
      2. Top 5 high-conviction holdings with tickers and approximate allocation %.
      3. Recent 'Whale' activity (Major additions or liquidations in the last 90 days).
      4. Sector weighting bias.
      5. Alpha Thesis: Why is this entity positioned this way?`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            entityName: { type: Type.STRING },
            strategyDescription: { type: Type.STRING },
            topHoldings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ticker: { type: Type.STRING },
                  name: { type: Type.STRING },
                  allocation: { type: Type.STRING },
                  sentiment: { type: Type.STRING, enum: ['Bullish', 'Neutral', 'Bearish'] }
                },
                required: ['ticker', 'allocation']
              }
            },
            recentActivity: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ticker: { type: Type.STRING },
                  action: { type: Type.STRING, enum: ['BUY', 'SELL', 'NEW', 'EXIT'] },
                  description: { type: Type.STRING }
                }
              }
            },
            sectorExposure: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sector: { type: Type.STRING },
                  weight: { type: Type.STRING }
                }
              }
            },
            alphaThesis: { type: Type.STRING },
            lastUpdated: { type: Type.STRING }
          },
          required: ['entityName', 'strategyDescription', 'topHoldings', 'recentActivity', 'alphaThesis']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getHighProfilePortfolio error:", error);
    return null;
  }
};

/**
 * NEW: Performs deep fundamental and sentiment analysis for currency pairs.
 */
export const getFXDeepAnalysis = async (pair: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep fundamental and sentiment analysis for the currency pair ${pair}. 
      Use search grounding to find latest central bank statements (Fed, ECB, BoJ, etc.), interest rate expectations, and macro data releases (CPI, NFP).
      
      Structure as markdown with these headers:
      ### **Macro Bias: [Bullish/Bearish/Neutral]**
      ### **Central Bank Sentiment**
      ### **Sentiment Pulse: [Retail vs Institutional]**
      ### **Upcoming Key Catalysts**
      ### **Target Range & Outlook**`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text;
  } catch (error) {
    console.error("getFXDeepAnalysis error:", error);
    return null;
  }
};

/**
 * NEW: Generates a deep multi-timeframe AI Technical Analysis.
 */
export const getAITechnicalAnalysis = async (ticker: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform an institutional-grade technical analysis for ${ticker} across multiple timeframes. 
      Use real-time search grounding to find current prices, RSI levels, EMA positions (20, 50, 200), and major support/resistance.
      
      Structure the response as:
      1. Day Trade (15m-1h view): Setup, Entry, Stop, Target, Risk Reward.
      2. Swing Trade (4h-1D view): Setup, Entry, Stop, Target, Trend Status.
      3. Long-term (Weekly view): Core Thesis, Institutional accumulation levels.
      4. Technical Score: A number 0-100 where 100 is Extremely Bullish.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ticker: { type: Type.STRING },
            technicalScore: { type: Type.NUMBER },
            dayTrade: {
              type: Type.OBJECT,
              properties: {
                setup: { type: Type.STRING },
                levels: { type: Type.STRING },
                indicators: { type: Type.STRING }
              }
            },
            swingTrade: {
              type: Type.OBJECT,
              properties: {
                setup: { type: Type.STRING },
                levels: { type: Type.STRING },
                trendStatus: { type: Type.STRING }
              }
            },
            longTerm: {
              type: Type.OBJECT,
              properties: {
                thesis: { type: Type.STRING },
                accumulationZone: { type: Type.STRING }
              }
            },
            keyConclusion: { type: Type.STRING }
          },
          required: ['ticker', 'technicalScore', 'dayTrade', 'swingTrade', 'longTerm', 'keyConclusion']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getAITechnicalAnalysis error:", error);
    return null;
  }
};

/**
 * Fetches real-time price and change for a specific ticker.
 */
export const getTickerQuote = async (ticker: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Fetch current market price and 24h performance for ${ticker}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER },
            change: { type: Type.STRING },
            isUp: { type: Type.BOOLEAN }
          },
          required: ['price', 'change', 'isUp']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getTickerQuote error:", error);
    return null;
  }
};

/**
 * Generates an executive market outlook report.
 */
export const getMarketOutlookAI = async () => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Generate a detailed market outlook report for the current trading session focusing on S&P 500 and Nasdaq.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            macroDrivers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'] }
                },
                required: ['title', 'description', 'impact']
              }
            },
            technicalOutlook: {
              type: Type.OBJECT,
              properties: {
                sp500: {
                  type: Type.OBJECT,
                  properties: {
                    sentiment: { type: Type.STRING },
                    keyLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
                    bias: { type: Type.STRING }
                  }
                },
                nasdaq: {
                  type: Type.OBJECT,
                  properties: {
                    sentiment: { type: Type.STRING },
                    keyLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
                    bias: { type: Type.STRING }
                  }
                }
              }
            },
            bullCase: { type: Type.ARRAY, items: { type: Type.STRING } },
            bearCase: { type: Type.ARRAY, items: { type: Type.STRING } },
            sectorsToWatch: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sector: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  rating: { type: Type.STRING, enum: ['Overweight', 'Underweight', 'Neutral'] }
                }
              }
            }
          },
          required: ['executiveSummary', 'macroDrivers', 'technicalOutlook', 'bullCase', 'bearCase', 'sectorsToWatch']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getMarketOutlookAI error:", error);
    return null;
  }
};

/**
 * Fetches current prices for multiple portfolio holdings.
 */
export const getPortfolioQuotes = async (tickers: string[]) => {
  if (tickers.length === 0) return {};
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Get the current live price for the following assets: ${tickers.join(', ')}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: tickers.reduce((acc: any, t) => {
            acc[t] = { type: Type.NUMBER };
            return acc;
          }, {})
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getPortfolioQuotes error:", error);
    return {};
  }
};

/**
 * Performs detailed sentiment analysis for a specific ticker.
 */
export const getDetailedSentimentAnalysis = async (ticker: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze sentiment for ${ticker} across news, social media, and institutional flow. Format as sections with headers.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "";
  } catch (error) {
    console.error("getDetailedSentimentAnalysis error:", error);
    return "";
  }
};

/**
 * Fetches market mood indexes for Stocks and Crypto.
 */
export const getMarketMood = async () => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Get current Fear/Greed index values for both the US Stock Market and Crypto Market.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stockValue: { type: Type.NUMBER },
            stockLabel: { type: Type.STRING },
            cryptoValue: { type: Type.NUMBER },
            cryptoLabel: { type: Type.STRING }
          },
          required: ['stockValue', 'stockLabel', 'cryptoValue', 'cryptoLabel']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getMarketMood error:", error);
    return null;
  }
};

/**
 * Gets specific social sentiment pulse for a ticker.
 */
export const getSentimentPulse = async (ticker: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze short-term social sentiment velocity for ${ticker}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            redditActivity: { type: Type.STRING },
            redditBias: { type: Type.STRING },
            twitterVelocity: { type: Type.STRING },
            twitterBias: { type: Type.STRING },
            institutionalFlow: { type: Type.STRING },
            alphaTip: { type: Type.STRING }
          },
          required: ['redditActivity', 'redditBias', 'twitterVelocity', 'twitterBias', 'institutionalFlow', 'alphaTip']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getSentimentPulse error:", error);
    return null;
  }
};

/**
 * Fetches latest breaking news headlines with AI sentiment analysis.
 * Uses real-time grounding on major financial outlets.
 */
export const getFinancialNews = async () => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify the 5 most critical breaking financial news stories from the last 60 minutes. 
      Specifically check real-time headlines on Finviz, FinancialJuice, Reuters, and Bloomberg. 
      For each, provide a factual headline, a concise summary, the source link, the source name, and a clinical sentiment analysis.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              link: { type: Type.STRING },
              source: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'] }
            },
            required: ['title', 'summary', 'link', 'sentiment', 'source', 'timestamp']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("getFinancialNews error:", error);
    return [];
  }
};

/**
 * Multimodal analysis of a chart image.
 */
export const analyzeChartImage = async (base64: string, mimeType: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64,
          },
        },
        {
          text: "Perform a technical analysis of this chart. Identify trend direction, support/resistance, notable patterns, indicator status, and suggest a potential trade setup. Format with clear headers like TREND, SUPPORT, PATTERN, INDICATORS, SETUP.",
        },
      ],
    });
    return response.text || "";
  } catch (error) {
    console.error("analyzeChartImage error:", error);
    return null;
  }
};

/**
 * Fallback mechanism for trending tickers using search grounding.
 */
export const getTrendingTickersFromAI = async () => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Identify the top trending 12 tickers on Reddit/WallStreetBets and social media currently.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rank: { type: Type.NUMBER },
              ticker: { type: Type.STRING },
              name: { type: Type.STRING },
              mentions: { type: Type.NUMBER },
              upvotes: { type: Type.NUMBER },
              rank_24h_ago: { type: Type.NUMBER },
              mentions_24h_ago: { type: Type.NUMBER }
            },
            required: ['rank', 'ticker', 'name', 'mentions', 'upvotes']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("getTrendingTickersFromAI error:", error);
    return [];
  }
};

/**
 * Starts a grounding-enabled chat session.
 */
export const startTerminalChat = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are an institutional AI trading assistant. You have real-time market grounding. Provide precise, professional analysis. If asked for data you don't have, search for it.",
      tools: [{ googleSearch: {} }]
    }
  });
};

/**
 * Calculates correlation matrix for given tickers.
 */
export const getCorrelationLabData = async (tickers: string[]) => {
  if (tickers.length === 0) return null;
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide a 30-day correlation matrix and summary analysis for these assets: ${tickers.join(', ')}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correlationList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tickerA: { type: Type.STRING },
                  tickerB: { type: Type.STRING },
                  coefficient: { type: Type.NUMBER }
                },
                required: ['tickerA', 'tickerB', 'coefficient']
              }
            },
            summary: { type: Type.STRING }
          },
          required: ['correlationList', 'summary']
        }
      }
    });
    
    const parsed = JSON.parse(response.text || '{}');
    const matrix: { [key: string]: { [key: string]: number } } = {};
    if (parsed.correlationList && Array.isArray(parsed.correlationList)) {
      parsed.correlationList.forEach((item: any) => {
        if (!matrix[item.tickerA]) matrix[item.tickerA] = {};
        if (!matrix[item.tickerB]) matrix[item.tickerB] = {};
        matrix[item.tickerA][item.tickerB] = item.coefficient;
        matrix[item.tickerB][item.tickerA] = item.coefficient;
      });
    }

    return { matrix, summary: parsed.summary };
  } catch (error) {
    console.error("getCorrelationLabData error:", error);
    return null;
  }
};

/**
 * Compiles natural language into PineScript V5.
 */
export const generatePineScript = async (description: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate TradingView PineScript V5 code for the following strategy description: ${description}. Include logic checks and explanations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            explanation: { type: Type.STRING },
            logicCheck: { type: Type.STRING }
          },
          required: ['code', 'explanation', 'logicCheck']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("generatePineScript error:", error);
    return null;
  }
};

/**
 * Analyzes latest SEC filings for a company.
 */
export const getSECFilingsIntelligence = async (ticker: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Search SEC EDGAR for the most recent 10-K/10-Q for ${ticker} and provide deep intelligence on risks, R&D, and provide direct links.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            rndSpending: { type: Type.STRING },
            filingLinks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  date: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          },
          required: ['executiveSummary', 'riskFactors', 'rndSpending', 'filingLinks']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getSECFilingsIntelligence error:", error);
    return null;
  }
};

/**
 * Connects to the Live Voice API.
 */
export const connectVoiceTerminal = (callbacks: any) => {
  const ai = getAI();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: "You are a professional terminal voice analyst. Provide high-fidelity, clinical responses to market queries. You have real-time grounding enabled via tool protocols (search). Keep responses succinct and data-driven.",
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
      }
    }
  });
};

/**
 * Performs deep fundamental and catalyst research.
 */
export const performDeepResearch = async (ticker: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Conduct a multi-phase deep investigation on ${ticker} including fundamentals, moat, risks, and consensus.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            fundamentalHealth: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.STRING },
                metrics: { type: Type.ARRAY, items: { type: Type.STRING } },
                narrative: { type: Type.STRING }
              }
            },
            catalysts: { type: Type.ARRAY, items: { type: Type.STRING } },
            competitiveEdge: { type: Type.STRING },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            consensus: {
              type: Type.OBJECT,
              properties: {
                targetPrice: { type: Type.STRING },
                buyHoldSell: { type: Type.STRING },
                institutionalTrend: { type: Type.STRING }
              }
            },
            strategicOutlook: { type: Type.STRING }
          },
          required: ['summary', 'fundamentalHealth', 'catalysts', 'competitiveEdge', 'risks', 'consensus', 'strategicOutlook']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("performDeepResearch error:", error);
    return null;
  }
};

/**
 * Audits options flow and analyst ratings.
 */
export const getOptionsAndRatings = async (ticker: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Audit derivative flow, IV rank, and recent analyst actions for ${ticker}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optionsSentiment: { type: Type.STRING },
            ivMetrics: {
              type: Type.OBJECT,
              properties: {
                ivRank: { type: Type.STRING },
                skewBias: { type: Type.STRING },
                narrative: { type: Type.STRING }
              }
            },
            unusualActivity: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  significance: { type: Type.STRING }
                }
              }
            },
            analystActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  firm: { type: Type.STRING },
                  action: { type: Type.STRING },
                  target: { type: Type.STRING },
                  date: { type: Type.STRING }
                }
              }
            },
            institutionalConfidence: { type: Type.NUMBER },
            alphaInsight: { type: Type.STRING }
          },
          required: ['optionsSentiment', 'ivMetrics', 'unusualActivity', 'analystActions', 'institutionalConfidence', 'alphaInsight']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getOptionsAndRatings error:", error);
    return null;
  }
};

/**
 * Predicts today's global market regime and US session trajectory.
 */
export const getGlobalMarketIntelligence = async () => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Model the today's US opening bell trajectory based on overnight global returns and 0DTE flow clusters.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            usSessionPrediction: {
              type: Type.OBJECT,
              properties: {
                openingBias: { type: Type.STRING },
                predictedRange: { type: Type.STRING },
                convictionScore: { type: Type.NUMBER },
                narrative: { type: Type.STRING }
              }
            },
            globalReturns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.STRING },
                  region: { type: Type.STRING },
                  changePercent: { type: Type.NUMBER },
                  status: { type: Type.STRING }
                }
              }
            },
            odteAnalysis: {
              type: Type.OBJECT,
              properties: {
                spxGammaLevel: { type: Type.STRING },
                callPutRatio: { type: Type.NUMBER },
                volatilityImpact: { type: Type.STRING },
                narrative: { type: Type.STRING }
              }
            },
            assetSentiments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  assetClass: { type: Type.STRING },
                  ticker: { type: Type.STRING },
                  sentimentScore: { type: Type.NUMBER },
                  bias: { type: Type.STRING },
                  keyDriver: { type: Type.STRING }
                }
              }
            },
            hotAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketRegime: { type: Type.STRING },
            liquidityStatus: { type: Type.STRING }
          },
          required: ['usSessionPrediction', 'globalReturns', 'odteAnalysis', 'assetSentiments', 'hotAlerts', 'marketRegime', 'liquidityStatus']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("getGlobalMarketIntelligence error:", error);
    return null;
  }
};

/**
 * Fetches Relative Rotation Graph (RRG) coordinates for S&P 500 sectors
 */
export const getSectorRRGData = async () => {
  try {
    const ai = getAI();
    const prompt = `Analyze the current Relative Rotation Graph (RRG) coordinates for the 11 S&P 500 sectors (XLK, XLE, XLV, XLF, XLI, XLP, XLU, XLB, XLY, XLC, XLRE) relative to the SPY benchmark.
    
    For each sector, provide:
    1. A 'history' array of the last 20 daily coordinates (JDK RS-Ratio and JDK RS-Momentum).
    2. The current quadrant.
    
    Return strictly as a JSON object. Ensure ratio and momentum are centered around 100. Be extremely precise with coordinates.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sectors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ticker: { type: Type.STRING },
                  name: { type: Type.STRING },
                  history: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        ratio: { type: Type.NUMBER },
                        momentum: { type: Type.NUMBER },
                        date: { type: Type.STRING }
                      },
                      required: ['ratio', 'momentum']
                    }
                  },
                  quadrant: { type: Type.STRING, enum: ['Leading', 'Weakening', 'Lagging', 'Improving'] }
                },
                required: ['ticker', 'name', 'history', 'quadrant']
              }
            },
            marketRegimeSummary: { type: Type.STRING },
            topRotationAlert: { type: Type.STRING }
          },
          required: ['sectors', 'marketRegimeSummary', 'topRotationAlert']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("RRG Error:", error);
    return null;
  }
};