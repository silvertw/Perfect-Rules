// Clash Mi / Mihomo 完整版覆寫腳本 (已修復 JS 正則表達式語法)

function main(params) {
  // 1. 取得所有節點名稱
  const proxies = params.proxies || [];
  const allProxyNames = proxies.map(p => p.name);
  
  // 定義地區匹配正則表達式 (使用標準 JS /.../i 語法)
  const regions = [
    { name: "香港节点", regex: /香港|港|HK|HongKong|Hong Kong|HKG/i },
    { name: "台湾节点", regex: /台灣|臺灣|台|TW|Taiwan|TWN/i },
    { name: "日本节点", regex: /日本|日|JP|Japan|TYO|KIX/i },
    { name: "新加坡节点", regex: /新加坡|狮城|獅城|SG|Singapore|SIN/i },
    { name: "美国节点", regex: /美國|美国|美|US|USA|United States/i }
  ];

  // 2. 動態生成地區策略組
  const autoGroups = [];
  const validRegionNames = [];

  regions.forEach(region => {
    const matchedProxies = proxies
      .filter(p => region.regex.test(p.name))
      .map(p => p.name);

    if (matchedProxies.length > 0) {
      validRegionNames.push(region.name);
      autoGroups.push({
        name: region.name,
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        interval: 300,
        tolerance: 50,
        proxies: matchedProxies
      });
    }
  });

  // 預設備用清單
  const baseProxies = validRegionNames.length > 0 ? validRegionNames : (allProxyNames.length > 0 ? allProxyNames : ["DIRECT"]);

  // 3. 建立主要的 Proxy Groups
  const customGroups = [
    {
      name: "PROXY",
      type: "select",
      proxies: ["自动选择", "故障转移", ...validRegionNames, "DIRECT"].concat(allProxyNames)
    },
    {
      name: "自动选择",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: allProxyNames.length > 0 ? allProxyNames : ["DIRECT"]
    },
    {
      name: "故障转移",
      type: "fallback",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      proxies: baseProxies
    },
    {
      name: "AI服务",
      type: "select",
      proxies: ["PROXY", ...validRegionNames, "DIRECT"]
    },
    {
      name: "YouTube",
      type: "select",
      proxies: ["PROXY", ...validRegionNames, "DIRECT"]
    },
    {
      name: "NetFlix",
      type: "select",
      proxies: ["PROXY", ...validRegionNames, "DIRECT"]
    },
    {
      name: "Disney+",
      type: "select",
      proxies: ["PROXY", ...validRegionNames, "DIRECT"]
    },
    {
      name: "Spotify",
      type: "select",
      proxies: ["PROXY", ...validRegionNames, "DIRECT"]
    },
    {
      name: "Telegram",
      type: "select",
      proxies: ["PROXY", ...validRegionNames, "DIRECT"]
    },
    {
      name: "Bilibili",
      type: "select",
      proxies: ["DIRECT", "PROXY", ...validRegionNames]
    },
    {
      name: "国内媒体",
      type: "select",
      proxies: ["DIRECT", "PROXY"]
    },
    {
      name: "国外媒体",
      type: "select",
      proxies: ["PROXY", ...validRegionNames, "DIRECT"]
    },
    {
      name: "微软服务",
      type: "select",
      proxies: ["DIRECT", "PROXY"]
    },
    {
      name: "苹果服务",
      type: "select",
      proxies: ["DIRECT", "PROXY"]
    },
    {
      name: "谷歌服务",
      type: "select",
      proxies: ["PROXY", ...validRegionNames, "DIRECT"]
    },
    {
      name: "游戏节点",
      type: "select",
      proxies: ["DIRECT", "PROXY", ...validRegionNames]
    },
    {
      name: "漏网之鱼",
      type: "select",
      proxies: ["PROXY", "DIRECT"]
    },
    {
      name: "广告拦截",
      type: "select",
      proxies: ["REJECT", "DIRECT", "PROXY"]
    }
  ];

  params["proxy-groups"] = [...customGroups, ...autoGroups];

  // 4. DNS 配置
  params["dns"] = {
    enable: true,
    ipv6: false,
    "listen": "0.0.0.0:1053",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": [
      "*.lan",
      "*.localdomain",
      "*.example",
      "*.invalid",
      "*.localhost",
      "*.test",
      "*.local",
      "*.home.arpa",
      "time.*.com",
      "time.*.gov",
      "time.*.edu.cn",
      "time.*.apple.com",
      "ntp.*.com",
      "*.time.edu.cn",
      "*.ntp.org.cn",
      "+.pool.ntp.org",
      "time1.cloud.tencent.com",
      "music.163.com",
      "*.music.163.com",
      "*.126.net",
      "hk.xunlei.com"
    ],
    "default-nameserver": ["223.5.5.5", "119.29.29.29", "1.1.1.1"],
    "nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query",
      "https://doh.dns.sb/dns-query"
    ]
  };

  // 5. Rule Providers (遠端規則集)
  params["rule-providers"] = {
    "reject": {
      type: "http",
      behavior: "domain",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
      path: "./ruleset/reject.yaml",
      interval: 86400
    },
    "icloud": {
      type: "http",
      behavior: "domain",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
      path: "./ruleset/icloud.yaml",
      interval: 86400
    },
    "apple": {
      type: "http",
      behavior: "domain",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
      path: "./ruleset/apple.yaml",
      interval: 86400
    },
    "google": {
      type: "http",
      behavior: "domain",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
      path: "./ruleset/google.yaml",
      interval: 86400
    },
    "proxy": {
      type: "http",
      behavior: "domain",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
      path: "./ruleset/proxy.yaml",
      interval: 86400
    },
    "direct": {
      type: "http",
      behavior: "domain",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
      path: "./ruleset/direct.yaml",
      interval: 86400
    },
    "gland": {
      type: "http",
      behavior: "domain",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gland.txt",
      path: "./ruleset/gland.yaml",
      interval: 86400
    },
    "telegramcidr": {
      type: "http",
      behavior: "ipcidr",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
      path: "./ruleset/telegramcidr.yaml",
      interval: 86400
    },
    "cncidr": {
      type: "http",
      behavior: "ipcidr",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
      path: "./ruleset/cncidr.yaml",
      interval: 86400
    },
    "lancidr": {
      type: "http",
      behavior: "ipcidr",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
      path: "./ruleset/lancidr.yaml",
      interval: 86400
    },
    "applications": {
      type: "http",
      behavior: "classical",
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
      path: "./ruleset/applications.yaml",
      interval: 86400
    },
    "openai": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
      path: "./ruleset/openai.yaml",
      interval: 86400
    }
  };

  // 6. 分流規則 (Rules)
  params["rules"] = [
    "RULE-SET,applications,DIRECT",
    "RULE-SET,lancidr,DIRECT",
    "RULE-SET,reject,广告拦截",
    "RULE-SET,openai,AI服务",
    "DOMAIN-SUFFIX,claude.ai,AI服务",
    "DOMAIN-KEYWORD,openai,AI服务",
    "RULE-SET,telegramcidr,Telegram",
    "RULE-SET,icloud,苹果服务",
    "RULE-SET,apple,苹果服务",
    "RULE-SET,google,谷歌服务",
    "DOMAIN-KEYWORD,youtube,YouTube",
    "DOMAIN-KEYWORD,netflix,NetFlix",
    "DOMAIN-KEYWORD,disney,Disney+",
    "DOMAIN-KEYWORD,spotify,Spotify",
    "DOMAIN-KEYWORD,bilibili,Bilibili",
    "RULE-SET,proxy,PROXY",
    "RULE-SET,direct,DIRECT",
    "RULE-SET,gland,DIRECT",
    "RULE-SET,cncidr,DIRECT",
    "GEOIP,LAN,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,漏网之鱼"
  ];

  return params;
}