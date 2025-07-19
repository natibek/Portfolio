from pathlib import Path
import yaml

img_to_src: dict[str, str] = {
    "Ampy":"ampy_logo.png",
    "Bootstrap": "bootstrap.png",
    "C": "c.png",
    "Cpp":"cpp.jpeg",
    "C++":"cpp.jpeg",
    "Crate":"crate.png",
    "Database":"database.png",
    "Django":"django.jpeg",
    "Flask":"flask.png",
    "Gtw":"guessthewiki_icon.svg",
    "Jinga":"jinga.png",
    "JavaScript":"js.jpg",
    "Marble":"marble.png",
    "Machine-Learning":"ml.jpeg",
    "OOP":"oop.png",
    "PsychoPy":"psychopy.jpg",
    "Pypi":"pypi.svg",
    "Python":"python.png",
    "Quantum":"quantum.png",
    "React":"react.png",
    "Rust":"rust.png",
    "Systems":"systems.jpg",
    "Testing":"testing.jpg",
    "Tkinter":"tk2.png",
}

github = '<i class="bi bi-github" id="git"></i>'

legend_template = """
<li class="tag">
  <input class="check-input" type="checkbox" value="" id="{input_id}" />
  <div class="icon"><img src="./public/{img_src}" width="30px"/></div><div class="tag">{name}</div>
</li> 
"""
def insert_legend(base: str) -> str:
    """Insert the legend information into the html page.

    Args:
        base: the base html 

    Returns the html string with the legend information added.
    """
    locator = "<!--Insert legend-content-->"
    pos = base.find(locator)
    before = base[:pos]
    after = base[pos:]

    with open("./src/legend-info.yaml", "r") as f:
        legends = yaml.safe_load(f)

    for legend in legends["legends"]:
        src = img_to_src[legend["name"]]
        legend["img_src"] = src

        legend_str = legend_template.format(**legend)
        before += legend_str

    before += after
    return before


coursework_template_start = """
<li class="filterable">
  {coursename}: <em>{skills}</em>&nbsp;
"""
coursework_img_template="""
  <img src="./public/{src}" width="{width}"  title="{title}"/>&nbsp;
"""
coursework_end_template="""
</li>
"""

def insert_coursework(base: str) -> str:
    """Insert the coursework information into the html page.

    Args:
        base: the base html 

    Returns the html string with coursework information added.
    """
    locator = "<!--Insert coursework-->"
    pos = base.find(locator)
    before = base[:pos]
    after = base[pos:]

    with open("./src/coursework.yaml", "r") as f:
        courses = yaml.safe_load(f)

    for course in courses["coursework"]:
        skills = ", ".join(course["skills"]) if course["skills"] else ""
        coursework = coursework_template_start.format(
            coursename=course["coursename"], skills=skills
        )

        for img in course["imgs"]:
            src = img_to_src[img["title"]]
            img_tag = coursework_img_template.format(
                width=img["width"], src=src, title=img["title"]
            )
            coursework += img_tag
        coursework += coursework_end_template
        before += coursework
    
    before += after
    return before

internship_work_exp_start_template = """
<li class="filterable">
  <a id="drop-down{i}" data-toggle="collapse" href="#collapse{i}" role="button" aria-expanded="false" aria-controls="collapse{i}" class="drop-down" >
    {position}
    <i class="bi bi-caret-down-fill" style="color: #800020;"></i>&nbsp;
"""
img_template="""
    <img src="./public/{src}" width="30px" title="{title}"/>&nbsp;
"""
topic_sentence_template = """
    <div class="topic-sentence">
     {topic_sentence}
    </div>
  </a>

  <div class="collapse" id="collapse{i}" data-parent="#accordion" aria-labelledby="drop-down{i}">
    <ul class="info">
"""
bullet_point_template="""
      <li>
        {bullet_point}
      </li>
"""
closing_tag ="""
     </ul>
   </div>
 </li>
"""

def insert_internship_work_experience(base: str, i: int, internship: bool) -> str:
    """Insert the internship/work experience information into the html page.

    Args:
        base: the base html 
        i: used for matching dropdown and collapse id in bootstrap
        interhship: True if inserting internship info, False if work experience

    Returns the html string with internship/work experience information added and the current i.
    """
    key = "internships" if internship else "work-experience"
    locator = f"<!--Insert {key}-->"
    pos = base.find(locator)
    before = base[:pos]
    after = base[pos:]

    with open(f"./src/{key}.yaml", "r") as f:
        experiences = yaml.safe_load(f)

    for exp in experiences[key]:
        
        exp_str = internship_work_exp_start_template.format(
            i=i, position=exp["position"], 
        )

        for skill in exp["skills"]:
            if not skill: break
            src = img_to_src[skill]
            exp_str += img_template.format(
                src=src, title=skill
            )
        
        exp_str += topic_sentence_template.format(
            i=i, topic_sentence=exp.get("topic_sentence", "")
        )

        for bullet_point in exp["bullet_points"]:
            exp_str += bullet_point_template.format(
                bullet_point=bullet_point
            )

        exp_str += closing_tag
        before+=exp_str
        i+=1
    
    before+=after

    return before, i



project_start_template = """<li class="filterable">
<a href="{link}" target="_blank">
"""

link_img_template = """
  <img src="./public/{src}" width="25px" alt="link" />
</a>&nbsp 
"""

project_middle_template = """
<a id="drop-down{i}" data-toggle="collapse" href="#collapse{i}" role="button" aria-expanded="false" aria-controls="collapse{i}" class="drop-down">
  {project}
  <i class="bi bi-caret-down-fill" style="color: #800020;"></i>&nbsp;
"""

github_icon="""
<i class="bi bi-github" id="git"></i>
"""

def insert_project(base: str, i: int, completed:bool) -> str:
    """Insert the project information into the html page.

    Args:
        base: the base html 
        i: used for matching dropdown and collapse id in bootstrap
        completed: True is inserting completed projects, False if in-progress.

    Returns the html string with project information added and the current i.
    """
    with open(f"./src/projects.yaml", "r") as f:
        projects = yaml.safe_load(f)

    status = "completed" if completed else "in-progress"
    locator = f"<!--Insert project-{status}-->"
    pos = base.find(locator)
    before = base[:pos]
    after = base[pos:]

    for project in projects[status]:
        project_str = project_start_template.format(
            link=project["link"]
        )

        if project["link_img"] == "github":
            project_str += github_icon
        else:
            project_str += link_img_template.format(
                src=img_to_src[project["link_img"]]
            )

        project_str += project_middle_template.format(
            i=i, project=project["project"]
        )

        for skill in project["skills"]:
            if not skill: break
            src = img_to_src[skill]
            project_str += img_template.format(
                src=src, title=skill
            )

        
        project_str += topic_sentence_template.format(
            i=i, topic_sentence=project.get("topic_sentence", "")
        )

        for bullet_point in project["bullet_points"]:
            project_str += bullet_point_template.format(
                bullet_point=bullet_point
            )

        project_str += closing_tag

        before += project_str
        i+=1

    before += after

    return before, i

if __name__ == "__main__":
    with open("./public/base.html", "r") as f:
        base = f.read()

    with_legend = insert_legend(base)
    with_coursework = insert_coursework(with_legend)
    with_internship, i = insert_internship_work_experience(with_coursework, 0, True)
    with_work_exp, i = insert_internship_work_experience(with_internship, i, False)
    with_project_completed, i = insert_project(with_work_exp, i, True)
    with_project_in_progress, i = insert_project(with_project_completed, i, False)

    with open("./index.html", "w") as f:
        f.write(with_project_in_progress)