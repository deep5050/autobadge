#!/usr/bin/env node
'use strict'

const qoa = require('qoa')
const Conf = require('conf');
const fs = require('fs');
const config = new Conf();

config.clear();
//console.log(config.path);
const shields = "https://img.shields.io";
const badgen = "https://badgen.net";

const table_header = `\n| Syntax    |    Badge  |\n| :---      |  :----:  |`;

var get_badge_text = (provider, path, url, alt) => {
    var type = "";
    var style = "";
   
    if (config.has('style')) {
        style = config.get('style');
    }
    if (config.has('type')) {
        type = config.get('type');
    }

    if (type === 'HTML') {
        return `<img alt="${alt}" src="${provider}${path}style=${style}"></img>`;
    }
    else if (type === 'MarkDown') {
        return `[![${alt}](${provider}${path}style=${style})](${url})`;
    }
}



var make_a_row = (val) => {
    return  "\n| `" + val + "` | " + val + "|";
}



var rating_bages = () => { }

var other_badges = (user, repo) => {
    var text = "\n## Other Badges\n"
    text += table_header;
    var url = `https://github.com/${user}/${repo}`;
    var hit_count = get_badge_text(
        "http://hits.dwyl.com",
        `/${user}/${repo}.svg?`,
        url,
        'Hit Count'
    );
    text += make_a_row(hit_count);

    return text;
}


var social_badges = (user, repo) => {
    var text = "\n## Social Badges\n"
    text += table_header;
    var url = `https://github.com/${user}/${repo}`;

    var followers = get_badge_text(
        shields,
        `/github/followers/${user}?`,
        url,
        'Followers'
    );
 
    text += make_a_row(followers);

    var forks = get_badge_text(
        shields,
        `/github/forks/${user}/${repo}?`,
        url,
        'Forks'
    );

    //console.log(forks);
    text += make_a_row(forks);


    var stars = get_badge_text(
        shields,
        `/github/stars/${user}/${repo}?`,
        url,
        'Stars'
    );
    // console.log(stars);
    text += make_a_row(stars);


    var watchers = get_badge_text(
        shields,
        `/github/watchers/${user}/${repo}?`,
        url,
        'Watchers'
    );
    //console.log(watchers);
    text += make_a_row(watchers);


    if (config.has('twitter')) {
        if (config.get('twitter') !== false && config.get('twitter.id') !== undefined) {
            var twitter_follow = get_badge_text(
                shields,
                `/twitter/follow/${config.get('twitter.id')}?logo=twitter&`,
                url,
                'Twitter Follow'
            );
            // console.log(twitter_follow);
            text += make_a_row(twitter_follow);
        }
    }
    return text;
}

var dependency_badges = (user, repo) => {

}


var version_badges = (user, repo) => {
    var text = "\n## Version Badges\n";
    text += table_header;
    var url = `https://github.com/${user}/${repo}`;

    var version = get_badge_text(
        shields,
        `/github/v/release/${user}/${repo}?`,
        url,
        'Release Version'
    );
    //console.log(version);
    text += make_a_row(version);
    return text;
}


var ci_cd_badges = (user, repo) => {
    var text = "\n## CI/CD Badges\n";
    text += table_header;
    var url = `https://github.com/${user}/${repo}`;

    if (config.get('github') === false || !config.has('github')) {
        return text = "\n## CI/CD Badges\n";
    }
    var github_workflow = get_badge_text(
        shields,
        `/github/workflow/status/${user}/${repo}/${config.get('github.workflow')}?label=${config.get('github.workflow')}&logo=github&`,
        url,
        'GitHub Workflow Status'
    );

    text += make_a_row(github_workflow);

    if (config.has('ci_cd_provider') && config.get('ci_cd_provider') === 'Travis') {
        var travis = get_badge_text(
            shields,
            `/travis/${user}/${repo}?label=Build&logo=travis&`,
            url,
            'Travis Build'
        );
        text += make_a_row(travis);
    }

    return text;
}


var activity_badges = (user, repo) => {
    var text = "\n## Activity Badges\n";
    text += table_header;
    var url = `https://github.com/${user}/${repo}`;

    var commits_per_month = get_badge_text(
        shields,
        `/github/commit-activity/m/${user}/${repo}?`,
        url,
        'Commits/month'
    );
    //console.log(commits_per_month);
    text += make_a_row(commits_per_month);


    var last_commit = get_badge_text(
        shields,
        `/github/last-commit/${user}/${repo}?`,
        url,
        'Last Commit'
    );
    // console.log(last_commit);
    text += make_a_row(last_commit);


    var relese_date = get_badge_text(
        shields,
        `/github/release-date/${user}/${repo}?`,
        url,
        'Last release date'
    );
    // console.log(relese_date);
    text += make_a_row(relese_date);


    var contributors = get_badge_text(
        shields,
        `/github/contributors/${user}/${repo}?`,
        url,
        'Contributors'
    );
    // console.log(contributors);
    text += make_a_row(contributors);

    return text;
}

var license_badges = (user, repo) => {
    var text = "\n## License Badges\n";
    text += table_header;
    var url = `https://github.com/${user}/${repo}`;
    var license = get_badge_text(
        shields,
        `/github/license/${user}/${repo}?`,
        url,
        'License'
    );
    // console.log(license);
    text += make_a_row(license);
    return text;
}


var size_badges = (user, repo) => {
    var text = "\n## Size Badges\n";
    text += table_header;

    var url = `https://github.com/${user}/${repo}`;
    var repo_size = get_badge_text(shields, `/github/repo-size/${user}/${repo}?`
    , url, 'Repo Size');
    // console.log(repo_size);
    text += make_a_row(repo_size);
    return text;
}


var analysis_badges = (user, repo) => {
    var text = "\n## Analysis Badges\n";
    text += table_header;
    var url = `https://github.com/${user}/${repo}`;

    var languages_count = get_badge_text(
        shields,
        `/github/languages/count/${user}/${repo}?`,
        url,
        'Language Count'
    );
    // console.log(languages_count);
    text += make_a_row(languages_count);

    var top_language = get_badge_text(
        shields,
        `/github/languages/top/${user}/${repo}?`,
        url,
        'Top Language'
    );
    // console.log(top_language);
    text += make_a_row(top_language);

    if (config.has('analysis_provider') && config.get('analysis_provider') === 'CodeClimate') {
        var codeclimate_maintain_percent = get_badge_text(
            shields,
            `/codeclimate/maintainability-percentage/${user}/${repo}?`,
            url,
            'Code Climate maintainability'
        );
        // console.log(codeclimate_maintain_percent);
        text += make_a_row(codeclimate_maintain_percent);

        var codeclimate_issues = get_badge_text(
            shields,
            `/codeclimate/issues/${user}/${repo}?`,
            url,
            "Code Climate Issues"
        );
        // console.log(codeclimate_issues);
        text += make_a_row(codeclimate_issues);

    }
    if (config.has('analysis_provider') && config.get('analysis_provider') === 'Codacy') {
        if (config.has('codacy.project_id') && config.get('codacy.project_id') !== "") {
            var codacy_project_id = config.get('codacy.project_id');
            var codacy_grade = get_badge_text(
                shields,
                 `/codacy/grade/${codacy_project_id}?`,
                url, 'Codacy Grade'
            );
            // console.log(codacy_grade);
            text += make_a_row(codacy_grade);
        }
    }
    return text;
}



var issues_badges = (user, repo) => {
    var text = "\n## Issues Badges\n";
    text += table_header;
    var url = `https://github.com/${user}/${repo}`;


    var issue_raw = get_badge_text(
        shields,
        `/github/issues-raw/${user}/${repo}?`,
        url,
        "Github Isuues"
    );
    // console.log(issues_raw);
    text += make_a_row(issue_raw);



    var issues_closed = get_badge_text(
        shields,
        `/github/issues-closed/${user}/${repo}?`,
        url,
        "Github closed Isuues"
    );
    // console.log(issues_closed);
    text += make_a_row(issues_closed);



    var pr_raw = get_badge_text(
        shields,
        `/github/issues-pr-raw/${user}/${repo}?`,
        url,
        "Github open PRs"
    );
    // console.log(pr_raw);
    text += make_a_row(pr_raw);



    var pr_closed = get_badge_text(
        shields,
        `/github/issues-pr-closed/${user}/${repo}?`,
        url,
        "Github closed PRs"
    );
    // console.log(pr_closed);
    text += make_a_row(pr_closed);

    return text;
}



var analyze_inputs = () => {

    const write_stream = fs.createWriteStream(`./autobadge-${config.get('repo')}-${config.get('style')}.md`);
    write_stream.write("# Autobadge\nThis is an auto-generated file\n");

    const user = config.get('user');
    const repo = config.get('repo');


    write_stream.write(license_badges(user, repo));
    write_stream.write(social_badges(user, repo));
    write_stream.write(size_badges(user, repo));
    write_stream.write(issues_badges(user, repo));
    write_stream.write(analysis_badges(user, repo));
    write_stream.write(activity_badges(user, repo));
    write_stream.write(version_badges(user, repo));
    write_stream.write(ci_cd_badges(user, repo));
    write_stream.write(other_badges(user, repo));

    console.log("\x1b[32m", "\nBadges Creation Completed :)");
}



const interactive_mode = async () => {

    var user = await qoa.input({
        query: 'Type your github username:',
        handle: 'user'
    });
    config.set(user);
    if (!config.has('user') || config.get('user') === "")
        throw new Error("Empty user name");


    var repo = await qoa.input({
        query: 'Type your repo name:',
        handle: 'repo'
    });
    config.set(repo);
    if (!config.has('repo') || config.get('repo') === "")
        throw new Error("Empty repo name");


    var style = await qoa.interactive({
        query: 'Badges style:',
        handle: 'style',
        symbol: '>',
        menu: [
            'flat',
            'flat-square',
            'plastic',
            'social',
            'for-the-badge'
        ]
    });
    config.set(style);


    var type = await qoa.interactive({
        query: 'Badges Type:',
        handle: 'type',
        symbol: '>',
        menu: [
            'MarkDown',
            'HTML'
        ]
    });
    config.set(type);

    var twitter = await qoa.confirm({
        query: 'Have Twitter Account?',
        handle: 'twitter',
        accept: 'y',
        deny: 'n'
    });
    config.set(twitter);
    if (config.get('twitter') == true) {
        var twitter_id = await qoa.input({
            query: 'Twitter Id:',
            handle: 'id'
        });
        config.set('twitter', twitter_id);
    }

    var ci_cd = await qoa.confirm({
        query: "Want CI/CD status?",
        handle: 'ci_cd',
        accept: 'y',
        deny: 'n'
    });
    config.set(ci_cd);

    if (config.get('ci_cd') === true) {
        var ci_cd_provider = await qoa.interactive({
            query: 'Your CI/CD provider:',
            handle: 'ci_cd_provider',
            symbol: '>',
            menu: [
                'Travis'
            ]
        });
        config.set(ci_cd_provider);
    }

    var analysis = await qoa.confirm({
        query: 'Code Analysis services added?',
        handle: 'analysis',
        accept: 'y',
        deny: 'n'
    });
    config.set(analysis);

    if (config.has('analysis') && config.get('analysis') === true) {
        var analysis_provider = await qoa.interactive({
            query: 'Your Code Analysis provider:',
            handle: 'analysis_provider',
            symbol: '>',
            menu: [
                'CodeClimate',
                'Codacy'
            ]
        });
        config.set(analysis_provider);
    }

    if (config.has('analysis_provider') && config.get('analysis_provider') === 'Codacy') {
        var project_id = await qoa.secure({
            query: 'Your Codacy Project ID:',
            handle: 'project_id'
        });
        config.set('codacy', project_id);
    }


    var github_workflow = await qoa.confirm({
        query: "GitHub Workflow added?",
        handle: "github",
        accept: 'y',
        deny: 'n'
    });
    config.set(github_workflow);

    if (config.has('github') && config.get('github') === true) {
        var workflow_name = await qoa.input({
            query: "Enter GitHub Workflow name:",
            handle: "workflow",
        });
        config.set('github', workflow_name);
    }
}


interactive_mode().then(analyze_inputs);
//analyze_inputs();