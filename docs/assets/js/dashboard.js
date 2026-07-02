(() => {
  const { policies, evidence, jobFamilies } = window.dashboardData;

    const jobFamilyNames = jobFamilies.map(item => item.name);

    function inferFamily(item) {
      if (item.type === "行业报告") return "趋势报告";
      const text = `${item.title} ${item.org} ${item.tags.join(" ")} ${item.summary}`.toLowerCase();
      if (/climate finance|绿色金融|转型金融|investment|投资规划|finance|气候风险|气候韧性|risk recovery/.test(text)) return "气候风险、绿色金融与国际发展";
      if (/环境影响评价|影响评价|排污许可|分区管控|环评|esia/.test(text)) return "环评、排污许可与分区管控";
      if (/核安全|辐射|执法|合规|ehs|应急/.test(text)) return "环境执法、合规与应急风险";
      if (/新污染物|化学品|化学物质|微\/纳塑料|全氟|毒性|健康|chemistry/.test(text)) return "新污染物、化学品与环境健康";
      if (/监测|监管|污染源|数智|数字|数据平台|data system|power platform|online|智能|ai|模型|模拟/.test(text)) return "环境监测、污染源监管与数智化";
      if (/生态损害|生态保护|自然保护|生物多样性|自然资本|生态价值|生态系统/.test(text)) return "生态保护、损害评估与自然资本";
      if (/soil|土壤|地下水|修复|水生态|水环境|大气|固废|废弃物|废物|湖泊|流域|海洋|污染治理|工厂环境/.test(text)) return "水、大气、固废、土壤与生态修复";
      if (/风险/.test(text)) return "环境执法、合规与应急风险";
      if (/战略规划|政策|标准|法规|美丽中国|国际组织|unep|unv|unu|ndc|international|cbam|气候服务|发展项目/.test(text)) return "生态环境规划、政策与标准";
      if (/mrv|carbon project|碳项目|碳核算|碳管理|碳市场|履约|decarbonization/.test(text)) return "碳管理、MRV与碳市场";
      if (/cleantech|renewables|energy|能源|绿色制造|零碳|节能|清洁生产|温室气体|减污降碳/.test(text)) return "工业减碳、零碳工厂与能源管理";
      if (/supply chain|sourcing|logistics|lca|product|产品|供应链|采购|材料|循环经济|碳足迹/.test(text)) return "产品碳足迹、LCA与绿色供应链";
      if (/esg|sustainability reporting|可持续发展|可持续管理|鉴证|披露|reporting|pwc/.test(text)) return "ESG披露、鉴证与可持续管理";
      return "生态环境规划、政策与标准";
    }

    evidence.forEach(item => {
      item.family = item.family || inferFamily(item);
    });

    const $ = selector => document.querySelector(selector);

    function uniqueTags(items) {
      const set = new Set(["全部方向"]);
      items.forEach(item => item.tags.forEach(tag => set.add(tag)));
      return Array.from(set);
    }

    function regionOptions(items) {
      const order = ["中国大陆", "亚太", "北美", "欧洲", "拉美", "全球/多地"];
      const present = new Set(items.map(item => item.region));
      return ["全部区域", ...order.filter(region => present.has(region))];
    }

    function badgeClass(type) {
      if (type === "岗位") return "job";
      if (type === "行业报告") return "report";
      return "org";
    }

    function countValues(items, getter) {
      return items.reduce((acc, item) => {
        const value = getter(item);
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});
    }

    function regionColor(region) {
      const colors = {
        "中国大陆": "#2563eb",
        "亚太": "#0f766e",
        "北美": "#7c3aed",
        "欧洲": "#f59e0b",
        "拉美": "#ef4444",
        "全球/多地": "#64748b"
      };
      return colors[region] || "#94a3b8";
    }

    function renderRegionStack(counts, order, total) {
      const rows = order
        .filter(region => counts[region])
        .map(region => ({ region, count: counts[region] }));
      return `
        <div class="region-stack" aria-label="区域分布">
          ${rows.map(row => `
            <div class="region-segment" style="width:${(row.count / total) * 100}%; background:${regionColor(row.region)}"></div>
          `).join("")}
        </div>
        <div class="region-legend">
          ${rows.map(row => `
            <span class="region-key">
              <span class="region-dot" style="background:${regionColor(row.region)}"></span>
              ${row.region} ${row.count}
            </span>
          `).join("")}
        </div>
      `;
    }

    function topDirectionTags(items) {
      const excluded = new Set(["上海", "深圳", "实习", "应届岗位", "行业趋势"]);
      const counts = {};
      items.forEach(item => {
        item.tags.forEach(tag => {
          if (!excluded.has(tag)) counts[tag] = (counts[tag] || 0) + 1;
        });
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));
    }

    function renderTrendSummary(baseRows, rows, selectedFamily) {
      if (!baseRows.length) {
        $("#trendSummary").innerHTML = "";
        return;
      }
      const regionCounts = countValues(rows, item => item.region);
      const familyCounts = countValues(baseRows, item => item.family);
      const visibleFamilies = jobFamilies.filter(family => familyCounts[family.name] > 0);
      const total = rows.length;
      $("#trendSummary").innerHTML = `
        ${visibleFamilies.length ? `
          <section class="summary-panel">
            <p class="summary-title">就业方向</p>
            <div class="family-grid">
              ${visibleFamilies.map(family => `
                <button class="family-card ${selectedFamily === family.name ? "active" : ""}" type="button" data-family="${family.name}">
                  <div class="family-top">
                    <span class="family-name">${family.name}</span>
                    <span class="family-count">${familyCounts[family.name]}项</span>
                  </div>
                  <p class="family-lane">${family.lane}</p>
                  <p class="family-desc">${family.desc}</p>
                </button>
              `).join("")}
            </div>
          </section>
        ` : ""}
        <section class="summary-panel">
          <p class="summary-title">区域分布</p>
          ${renderRegionStack(regionCounts, ["中国大陆", "亚太", "北美", "欧洲", "拉美", "全球/多地"], total)}
        </section>
      `;
      document.querySelectorAll(".family-card").forEach(card => {
        card.addEventListener("click", () => {
          $("#evidenceFamily").value = card.dataset.family;
          renderEvidence();
        });
      });
    }

    function renderEvidenceFilters() {
      const types = ["全部类型", ...Array.from(new Set(evidence.map(item => item.type)))];
      $("#evidenceType").innerHTML = types.map(type => `<option>${type}</option>`).join("");
      $("#evidenceRegion").innerHTML = regionOptions(evidence).map(region => `<option>${region}</option>`).join("");
      $("#evidenceFamily").innerHTML = ["全部就业方向", ...jobFamilyNames, "趋势报告"].map(family => `<option>${family}</option>`).join("");
      $("#evidenceTotal").textContent = evidence.length;
      $("#evidenceType").addEventListener("change", () => {
        $("#evidenceFamily").value = "全部就业方向";
        renderEvidence();
      });
      $("#evidenceRegion").addEventListener("change", renderEvidence);
      $("#evidenceFamily").addEventListener("change", renderEvidence);
      $("#clearEvidence").addEventListener("click", () => {
        $("#evidenceType").value = "全部类型";
        $("#evidenceRegion").value = "全部区域";
        $("#evidenceFamily").value = "全部就业方向";
        renderEvidence();
      });
    }

    function renderPolicies() {
      const grouped = policies.reduce((acc, item) => {
        (acc[item.date] ||= []).push(item);
        return acc;
      }, {});
      const months = Object.keys(grouped).sort();
      $("#policyList").innerHTML = months.length ? `
        <div class="timeline">
          ${months.map(month => `
            <section class="timeline-month">
              <div class="month-label">${month.replace("2026-", "")}月</div>
              <div class="month-items">
                ${grouped[month].map(item => `
                  <article class="card">
                    <div class="card-top">
                      <h3 class="card-title">
                        <a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a>
                      </h3>
                    </div>
                    <p class="body-text">${item.summary}</p>
                  </article>
                `).join("")}
              </div>
            </section>
          `).join("")}
        </div>
      ` : `<div class="empty">没有符合条件的政策。</div>`;
    }

    function renderEvidence() {
      const type = $("#evidenceType").value;
      const region = $("#evidenceRegion").value;
      const family = $("#evidenceFamily").value;
      const baseRows = evidence.filter(item => {
        const hitType = type === "全部类型" || item.type === type;
        const hitRegion = region === "全部区域" || item.region === region;
        return hitType && hitRegion;
      });
      const availableFamilies = new Set(baseRows.map(item => item.family));
      const activeFamily = family !== "全部就业方向" && !availableFamilies.has(family) ? "全部就业方向" : family;
      if (activeFamily !== family) $("#evidenceFamily").value = activeFamily;
      const rows = baseRows.filter(item => activeFamily === "全部就业方向" || item.family === activeFamily);
      renderTrendSummary(baseRows, rows, activeFamily);
      $("#evidenceList").innerHTML = rows.map(item => `
        <article class="card">
          <div class="card-top">
            <h3 class="card-title">
              <a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a>
            </h3>
            <span class="badge ${badgeClass(item.type)}">${item.type}</span>
          </div>
          <p class="meta">${item.org} · ${item.region} · ${item.family}</p>
          <p class="body-text">${item.summary}</p>
          <div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
        </article>
      `).join("") || `<div class="empty">没有符合条件的内容。</div>`;
    }

    renderEvidenceFilters();
    renderPolicies();
    renderEvidence();

})();
