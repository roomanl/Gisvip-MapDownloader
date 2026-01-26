/**
 * 随机生成 User-Agent 工具类
 * 支持随机生成不同浏览器、不同系统的 User-Agent 字符串
 * 版本号动态随机生成，设备列表扩充至300+
 */
export class RandomUserAgent {
  // 定义 User-Agent 模板库，按类型分类
  private static readonly userAgentTemplates = {
    // 桌面端 Chrome
    desktopChrome: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version} Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_{osVersion}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version} Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version} Safari/537.36'
    ],
    // 桌面端 Firefox
    desktopFirefox: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:{version}) Gecko/20100101 Firefox/{version}',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_{osVersion}; rv:{version}) Gecko/20100101 Firefox/{version}',
      'Mozilla/5.0 (X11; Linux x86_64; rv:{version}) Gecko/20100101 Firefox/{version}'
    ],
    // 移动端 Chrome (Android)
    mobileChrome: [
      'Mozilla/5.0 (Linux; Android {androidVersion}; {device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version} Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android {androidVersion}; {device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version} Mobile Safari/537.36 Edg/{edgVersion}'
    ],
    // 移动端 Safari (iOS)
    mobileSafari: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS {iosVersion} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/{safariVersion} Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS {iosVersion} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/{safariVersion} Mobile/15E148 Safari/604.1'
    ]
  };

  // ========== 扩充至300+的设备列表 ==========
  private static readonly devices = [
    // 谷歌 Pixel 系列
    'Pixel 6', 'Pixel 6 Pro', 'Pixel 6a', 'Pixel 7', 'Pixel 7 Pro', 'Pixel 7a',
    'Pixel 8', 'Pixel 8 Pro', 'Pixel 8a', 'Pixel 9', 'Pixel 9 Pro', 'Pixel 9 Pro XL', 'Pixel Fold',
    // 三星 Galaxy S 系列
    'Galaxy S20', 'Galaxy S20+', 'Galaxy S20 Ultra', 'Galaxy S20 FE',
    'Galaxy S21', 'Galaxy S21+', 'Galaxy S21 Ultra', 'Galaxy S21 FE',
    'Galaxy S22', 'Galaxy S22+', 'Galaxy S22 Ultra',
    'Galaxy S23', 'Galaxy S23+', 'Galaxy S23 Ultra',
    'Galaxy S24', 'Galaxy S24+', 'Galaxy S24 Ultra',
    // 三星 Galaxy Note 系列
    'Galaxy Note 20', 'Galaxy Note 20 Ultra', 'Galaxy Note 10', 'Galaxy Note 10+',
    // 三星 Galaxy A 系列（中端）
    'Galaxy A13', 'Galaxy A14', 'Galaxy A23', 'Galaxy A24', 'Galaxy A33', 'Galaxy A34', 'Galaxy A53', 'Galaxy A54', 'Galaxy A73', 'Galaxy A74',
    'Galaxy A15', 'Galaxy A25', 'Galaxy A35', 'Galaxy A55', 'Galaxy A75',
    // 三星 Galaxy Z 系列（折叠屏）
    'Galaxy Z Flip 3', 'Galaxy Z Flip 4', 'Galaxy Z Flip 5', 'Galaxy Z Flip 6',
    'Galaxy Z Fold 3', 'Galaxy Z Fold 4', 'Galaxy Z Fold 5', 'Galaxy Z Fold 6',
    // 华为 Mate 系列
    'Mate 40', 'Mate 40 Pro', 'Mate 40 Pro+', 'Mate 40 RS Porsche Design',
    'Mate 50', 'Mate 50 Pro', 'Mate 50 RS Porsche Design',
    'Mate 60', 'Mate 60 Pro', 'Mate 60 Pro+', 'Mate 60 RS Ultimate Design',
    'Mate 70', 'Mate 70 Pro', 'Mate 70 Pro+', 'Mate 70 RS Ultimate Design',
    // 华为 P 系列
    'P40', 'P40 Pro', 'P40 Pro+',
    'P50', 'P50 Pro', 'P50 Pocket',
    'P60', 'P60 Pro', 'P60 Art',
    'P70', 'P70 Pro', 'P70 Art',
    // 华为 Nova 系列
    'Nova 9', 'Nova 9 Pro', 'Nova 10', 'Nova 10 Pro', 'Nova 11', 'Nova 11 Pro', 'Nova 11 Ultra',
    'Nova 12', 'Nova 12 Pro', 'Nova 12 Ultra', 'Nova 13', 'Nova 13 Pro', 'Nova 13 Ultra',
    // 华为 畅享 系列
    'changxiang 50', 'changxiang 50 Pro', 'changxiang 60', 'changxiang 60 Pro', 'changxiang 70', 'changxiang 70 Pro',
    // 小米 数字系列
    'Mi 11', 'Mi 11 Pro', 'Mi 11 Ultra', 'Mi 11 Lite',
    'Mi 12', 'Mi 12 Pro', 'Mi 12 Ultra', 'Mi 12 Lite', 'Mi 12S', 'Mi 12S Pro', 'Mi 12S Ultra',
    'Mi 13', 'Mi 13 Pro', 'Mi 13 Ultra', 'Mi 13 Lite',
    'Mi 14', 'Mi 14 Pro', 'Mi 14 Ultra', 'Mi 14 Lite',
    // 小米 Redmi K 系列
    'Redmi K40', 'Redmi K40 Pro', 'Redmi K40 Pro+', 'Redmi K40S',
    'Redmi K50', 'Redmi K50 Pro', 'Redmi K50 Ultra', 'Redmi K50i',
    'Redmi K60', 'Redmi K60 Pro', 'Redmi K60 Ultra', 'Redmi K60E',
    'Redmi K70', 'Redmi K70 Pro', 'Redmi K70 Ultra', 'Redmi K70E',
    'Redmi K80', 'Redmi K80 Pro', 'Redmi K80 Ultra',
    // 小米 Redmi Note 系列
    'Redmi Note 10', 'Redmi Note 10 Pro', 'Redmi Note 10S',
    'Redmi Note 11', 'Redmi Note 11 Pro', 'Redmi Note 11 Pro+', 'Redmi Note 11S',
    'Redmi Note 12', 'Redmi Note 12 Pro', 'Redmi Note 12 Pro+', 'Redmi Note 12 Turbo', 'Redmi Note 12S',
    'Redmi Note 13', 'Redmi Note 13 Pro', 'Redmi Note 13 Pro+', 'Redmi Note 13 Turbo', 'Redmi Note 13S',
    'Redmi Note 14', 'Redmi Note 14 Pro', 'Redmi Note 14 Pro+',
    // 小米 Civi 系列
    'Civi 1', 'Civi 1S', 'Civi 2', 'Civi 3', 'Civi 4', 'Civi 4 Pro',
    // OPPO Find X 系列
    'Find X3', 'Find X3 Pro', 'Find X3 Neo',
    'Find X5', 'Find X5 Pro', 'Find X5 Lite',
    'Find X6', 'Find X6 Pro', 'Find X6 Lite',
    'Find X7', 'Find X7 Pro', 'Find X7 Ultra',
    // OPPO Reno 系列
    'Reno 7', 'Reno 7 Pro', 'Reno 7 SE',
    'Reno 8', 'Reno 8 Pro', 'Reno 8 Pro+', 'Reno 8 SE',
    'Reno 9', 'Reno 9 Pro', 'Reno 9 Pro+',
    'Reno 10', 'Reno 10 Pro', 'Reno 10 Pro+',
    'Reno 11', 'Reno 11 Pro', 'Reno 11 Pro+',
    'Reno 12', 'Reno 12 Pro', 'Reno 12 Pro+',
    // OPPO K 系列
    'K9', 'K9 Pro', 'K10', 'K10 Pro', 'K11', 'K11 Pro', 'K12', 'K12 Pro',
    // vivo X 系列
    'X70', 'X70 Pro', 'X70 Pro+',
    'X80', 'X80 Pro', 'X80 Lite',
    'X90', 'X90 Pro', 'X90 Pro+', 'X90 Lite',
    'X100', 'X100 Pro', 'X100 Ultra', 'X100 Lite',
    'X200', 'X200 Pro', 'X200 Ultra',
    // vivo S 系列
    'S12', 'S12 Pro', 'S15', 'S15 Pro', 'S16', 'S16 Pro', 'S17', 'S17 Pro', 'S18', 'S18 Pro', 'S19', 'S19 Pro',
    // vivo iQOO 系列
    'iQOO 8', 'iQOO 8 Pro', 'iQOO 9', 'iQOO 9 Pro', 'iQOO 10', 'iQOO 10 Pro',
    'iQOO 11', 'iQOO 11 Pro', 'iQOO 12', 'iQOO 12 Pro', 'iQOO 13', 'iQOO 13 Pro',
    'iQOO Neo 5', 'iQOO Neo 6', 'iQOO Neo 7', 'iQOO Neo 8', 'iQOO Neo 9', 'iQOO Neo 10',
    'iQOO Z3', 'iQOO Z5', 'iQOO Z6', 'iQOO Z7', 'iQOO Z8', 'iQOO Z9',
    // 一加 OnePlus 系列
    'OnePlus 9', 'OnePlus 9 Pro', 'OnePlus 9R', 'OnePlus 9RT',
    'OnePlus 10', 'OnePlus 10 Pro', 'OnePlus 10R',
    'OnePlus 11', 'OnePlus 11R',
    'OnePlus 12', 'OnePlus 12R',
    'OnePlus 13', 'OnePlus 13R',
    'OnePlus Nord 2', 'OnePlus Nord 3', 'OnePlus Nord CE 2', 'OnePlus Nord CE 3', 'OnePlus Nord N20', 'OnePlus Nord N30',
    // realme 真我 系列
    'realme GT', 'realme GT Neo', 'realme GT Neo 2', 'realme GT Neo 3', 'realme GT Neo 5', 'realme GT Neo 6',
    'realme GT 2', 'realme GT 2 Pro', 'realme GT 3', 'realme GT 3 Pro',
    'realme Q3', 'realme Q3 Pro', 'realme Q5', 'realme Q5 Pro', 'realme Q6', 'realme Q6 Pro',
    'realme 10', 'realme 10 Pro', 'realme 10 Pro+', 'realme 11', 'realme 11 Pro', 'realme 11 Pro+', 'realme 12', 'realme 12 Pro', 'realme 12 Pro+',
    // 荣耀 Magic 系列
    'Magic 3', 'Magic 3 Pro', 'Magic 3 Pro+',
    'Magic 4', 'Magic 4 Pro', 'Magic 4 Ultimate',
    'Magic 5', 'Magic 5 Pro', 'Magic 5 Ultimate',
    'Magic 6', 'Magic 6 Pro', 'Magic 6 Ultimate',
    // 荣耀 数字系列
    'Honor 50', 'Honor 50 Pro', 'Honor 60', 'Honor 60 Pro', 'Honor 70', 'Honor 70 Pro', 'Honor 70 Pro+',
    'Honor 80', 'Honor 80 Pro', 'Honor 90', 'Honor 90 Pro', 'Honor 100', 'Honor 100 Pro',
    // 魅族 系列
    'Meizu 18', 'Meizu 18 Pro', 'Meizu 18s', 'Meizu 18s Pro',
    'Meizu 19', 'Meizu 19 Pro', 'Meizu 20', 'Meizu 20 Pro', 'Meizu 20 Classic', 'Meizu 21', 'Meizu 21 Pro',
    // 坚果 系列
    'Smartisan Nut Pro 3', 'Smartisan Nut R2',
    // iOS 设备（iPad/iPhone）
    'iPhone 12', 'iPhone 12 mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
    'iPhone 13', 'iPhone 13 mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
    'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
    'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
    'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max',
    'iPad Air 4', 'iPad Air 5', 'iPad Air 6',
    'iPad Pro 11-inch (3rd gen)', 'iPad Pro 11-inch (4th gen)', 'iPad Pro 11-inch (5th gen)',
    'iPad Pro 12.9-inch (5th gen)', 'iPad Pro 12.9-inch (6th gen)', 'iPad Pro 12.9-inch (7th gen)',
    'iPad mini 6', 'iPad mini 7'
  ];

  /**
   * 生成指定范围的随机整数
   */
  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 随机选择数组中的一个元素
   */
  private static randomPick<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  // ========== 动态版本号生成函数 ==========
  /**
   * 生成 Chrome 版本号（格式：主版本.0.次版本.修订版本，如 117.0.5938.92）
   */
  private static generateChromeVersion(): string {
    // Chrome 主版本号范围：110-120（主流版本）
    const major = this.randomInt(110, 120);
    const minor1 = 0; // 固定为0
    const minor2 = this.randomInt(5000, 6000);
    const patch = this.randomInt(10, 100);
    return `${major}.${minor1}.${minor2}.${patch}`;
  }

  /**
   * 生成 Firefox 版本号（格式：主版本.次版本.修订版本，如 117.0.1）
   */
  private static generateFirefoxVersion(): string {
    // Firefox 主版本号范围：110-120
    const major = this.randomInt(110, 120);
    const minor = this.randomInt(0, 2);
    const patch = this.randomInt(0, 3);
    return `${major}.${minor}.${patch}`;
  }

  /**
   * 生成 Edge 版本号（格式同 Chrome）
   */
  private static generateEdgeVersion(): string {
    return this.generateChromeVersion(); // Edge 版本格式与 Chrome 一致
  }

  /**
   * 生成 Android 版本号（格式：纯数字，如 14）
   */
  private static generateAndroidVersion(): string {
    // Android 主流版本：10-14
    return this.randomInt(10, 14).toString();
  }

  /**
   * 生成 iOS 版本号（格式：xx_xx，如 17_2）
   */
  private static generateIOSVersion(): string {
    // iOS 主流版本：16.x - 17.x
    const major = this.randomInt(16, 17);
    const minor = this.randomInt(0, 5);
    return `${major}_${minor}`;
  }

  /**
   * 生成 Safari 版本号（格式：xx.xx，如 17.1）
   */
  private static generateSafariVersion(): string {
    // Safari 主流版本：16.x - 17.x
    const major = this.randomInt(16, 17);
    const minor = this.randomInt(0, 5);
    return `${major}.${minor}`;
  }

  /**
   * 生成 macOS 版本号（格式：纯数字，如 15）
   */
  private static generateOSXVersion(): string {
    // macOS 主流版本：12-15（Monterey 到 Sequoia）
    return this.randomInt(12, 15).toString();
  }

  /**
   * 渲染 User-Agent 模板，替换占位符（使用动态生成的版本号）
   */
  private static renderTemplate(template: string): string {
    return template
      .replace(/\{version\}/g, this.generateChromeVersion())
      .replace(/\{androidVersion\}/g, this.generateAndroidVersion())
      .replace(/\{iosVersion\}/g, this.generateIOSVersion())
      .replace(/\{safariVersion\}/g, this.generateSafariVersion())
      .replace(/\{edgVersion\}/g, this.generateEdgeVersion())
      .replace(/\{osVersion\}/g, this.generateOSXVersion())
      .replace(/\{device\}/g, this.randomPick(this.devices));
  }

  /**
   * 生成随机 User-Agent
   * @param type 可选，指定类型：desktop/mobile/all (默认all)
   * @returns 随机生成的 User-Agent 字符串
   */
  static generate(type: 'desktop' | 'mobile' | 'all' = 'all'): string {
    let availableTemplates: string[] = [];

    // 根据类型筛选模板
    switch (type) {
      case 'desktop':
        availableTemplates = [
          ...this.userAgentTemplates.desktopChrome,
          ...this.userAgentTemplates.desktopFirefox
        ];
        break;
      case 'mobile':
        availableTemplates = [
          ...this.userAgentTemplates.mobileChrome,
          ...this.userAgentTemplates.mobileSafari
        ];
        break;
      case 'all':
        availableTemplates = [
          ...this.userAgentTemplates.desktopChrome,
          ...this.userAgentTemplates.desktopFirefox,
          ...this.userAgentTemplates.mobileChrome,
          ...this.userAgentTemplates.mobileSafari
        ];
        break;
    }

    // 随机选择模板并渲染
    const randomTemplate = this.randomPick(availableTemplates);
    return this.renderTemplate(randomTemplate);
  }

  /**
   * 批量生成多个随机 User-Agent
   * @param count 生成数量
   * @param type 类型筛选
   * @returns User-Agent 数组
   */
  static generateBatch(count: number, type: 'desktop' | 'mobile' | 'all' = 'all'): string[] {
    if (count <= 0) return [];
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(this.generate(type));
    }
    return result;
  }
}